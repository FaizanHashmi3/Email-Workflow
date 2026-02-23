"use client"

import { Header } from "../Header"
import WorkflowCard from "./WorkflowCard"

export const LandingPage = ({
    loading,
    workflows,
    setOpen,
    setEditWorkflow,
    fetchWorkflows,
    setHistoryOpen
}: any) => {

    return (
        <div className="content-scroll">

            <Header
                setHistoryOpen={setHistoryOpen}
                setOpen={setOpen}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 p-3 gap-6">

                {loading && (
                    [...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="card skeleton"
                        />
                    ))
                )}

                {!loading && workflows?.length === 0 && (
                    <div className="empty col-span-2 md:col-span-3">
                        <p>No workflows yet</p>

                        <button
                            onClick={() => setOpen(true)}
                            className="btn btn-primary"
                        >
                            Create your first workflow
                        </button>
                    </div>
                )}

                {!loading && workflows?.length > 0 && (
                    workflows.map((workflow: any) => (
                        <WorkflowCard
                            key={workflow._id}
                            workflow={workflow}
                            refresh={fetchWorkflows}
                            setEditWorkflow={setEditWorkflow}
                            setEditOpen={setOpen}
                        />
                    ))
                )}

            </div>

        </div>
    )
}