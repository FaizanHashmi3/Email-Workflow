"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { triggerWorkflow, deleteWorkflow } from "@/lib/workflowApi";
import { Trash2, Pencil } from "lucide-react";

interface Workflow {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    scheduledAt?: string | null;
}

interface WorkflowCardProps {
    workflow: Workflow;
    refresh: () => void;
    setEditOpen: (arg0: boolean) => void;
    setEditWorkflow: (arg0: any) => void;
}

export default function WorkflowCard({
    workflow,
    refresh,
    setEditOpen,
    setEditWorkflow,
}: WorkflowCardProps) {

    const initialFuture = workflow.scheduledAt
        ? new Date(workflow.scheduledAt) > new Date()
        : false;

    const [loading, setLoading] = useState(false);
    const [isFutureScheduled, setIsFutureScheduled] = useState(initialFuture);

    useEffect(() => {
        if (!workflow.scheduledAt) {
            setIsFutureScheduled(false);
            return;
        }

        const checkSchedule = () => {
            const isFuture = new Date(workflow.scheduledAt as string) > new Date();
            setIsFutureScheduled(isFuture);
        };

        checkSchedule();
        const timer = setInterval(checkSchedule, 1000);

        return () => clearInterval(timer);
    }, [workflow.scheduledAt]);

    const handleTrigger = async () => {
        try {
            setLoading(true);
            const res: any = await triggerWorkflow(workflow._id);
            if (res.error) {
                toast.error(res.error)
            }
            else {
                toast.success(res.message);
            }
        } catch {
            toast.error("Failed to trigger");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteWorkflow(workflow._id);
            toast.success("Workflow deleted");
            refresh?.();
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015 }}
            transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.05
            }}
            className="card workflow-card"
        >
            <button
                onClick={() => {
                    setEditOpen(true);
                    setEditWorkflow(workflow);
                }}
                className="edit-btn"
            >
                <Pencil size={16} />
            </button>

            <button
                onClick={handleDelete}
                className="delete-btn"
            >
                <Trash2 size={16} />
            </button>

            <div>
                <h3
                    className="font-semibold truncate max-w-[160px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[340px]"
                    title={workflow.name}
                >
                    {workflow.name}
                </h3>

                <p
                    className="text-sm text-muted mt-1 truncate max-w-[160px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[340px]"
                    title={workflow.email}
                >
                    {workflow.email}
                </p>

                {isFutureScheduled && workflow.scheduledAt && (
                    <p className="text-xs text-muted mt-2">
                        {new Date(workflow.scheduledAt).toLocaleString()}
                    </p>
                )}
            </div>

            {isFutureScheduled ? (
                <div className="mt-4">
                    <span className="px-2 py-1 text-xs rounded-lg border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                        Scheduled
                    </span>
                </div>
            ) : (
                <div className="mt-4">
                    <button
                        onClick={handleTrigger}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? "Triggering..." : "Trigger"}
                    </button>
                </div>
            )}
        </motion.div>
    );
}