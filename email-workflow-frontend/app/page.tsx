"use client";

import { useState, useEffect } from "react";

import CreateWorkflowModal from "@/components/workflow/CreateWorkflowModal";
import ExecutionDrawer from "@/components/ExecutionDrawer";
import { getWorkflows } from "@/lib/workflowApi";
import { LandingPage } from "@/components/workflow/LandingPage";

interface Workflow {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Page() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const loadWorkflows = async () => {
    setLoading(true);

    try {
      const response: any = await getWorkflows();
      setWorkflows(response || []);
    } catch (err) {
      console.error("Failed to load workflows", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleCloseModal = () => {

    setIsCreateOpen(false);
    setSelectedWorkflow(null);
  };

  return (
    <main className="page">
      <LandingPage
        loading={loading}
        workflows={workflows}
        setOpen={setIsCreateOpen}
        setHistoryOpen={setIsHistoryOpen}
        setEditWorkflow={setSelectedWorkflow}
        fetchWorkflows={loadWorkflows}
      />

      <CreateWorkflowModal
        open={isCreateOpen}
        onClose={handleCloseModal}
        workflow={selectedWorkflow}
        refresh={loadWorkflows}
      />

      <ExecutionDrawer
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </main>
  );
}