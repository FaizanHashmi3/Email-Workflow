"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import api from "@/lib/axios";

export default function ExecutionDrawer({ open, onClose }: any) {
    const [executions, setExecutions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        const fetchExecutions = async () => {
            setIsLoading(true);

            try {
                const response: any = await api.get("/executions");
                setExecutions(response || []);
            } catch (err) {
                console.error("Failed to load executions", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExecutions();
    }, [open]);

    const isEmpty = !isLoading && executions.length === 0;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                    />

                    {/* drawer */}
                    <motion.div
                        initial={{ x: 420 }}
                        animate={{ x: 0 }}
                        exit={{ x: 420 }}
                        transition={{ type: "spring", damping: 30 }}
                        className="execution-drawer fixed right-0 top-0 h-full w-[400px] z-[9999] p-6"
                    >
                        {/* header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">
                                Execution History
                            </h2>

                            <button
                                onClick={onClose}
                                className="btn btn-secondary p-2"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* content */}
                        <div className="content-scroll space-y-4 overflow-y-auto h-[calc(100%-60px)] pr-2">
                            {isLoading && (
                                <p className="text-sm text-muted">
                                    Loading...
                                </p>
                            )}

                            {isEmpty && (
                                <p className="text-sm text-muted">
                                    No executions yet
                                </p>
                            )}

                            {executions.map((entry: any) => (
                                <div
                                    key={entry._id}
                                    className="execution-card p-4"
                                >
                                    <p className="font-medium">
                                        {entry.workflowName}
                                    </p>

                                    <p className="text-xs text-muted mt-1">
                                        {entry.email}
                                    </p>

                                    <div className="flex justify-between mt-3">
                                        <span
                                            className="text-xs"
                                            style={{
                                                color:
                                                    entry.status === "success"
                                                        ? "#22c55e"
                                                        : "#ef4444",
                                            }}
                                        >
                                            {entry.status}
                                        </span>

                                        <span className="text-xs text-muted">
                                            {new Date(
                                                entry.executedAt
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}