"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createWorkflow, updateWorkflow } from "@/lib/workflowApi";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

interface CreateWorkflowModalProps {
    open: boolean;
    onClose: () => void;
    refresh?: () => void;
    workflow?: any;
}

interface WorkflowFormValues {
    name: string;
    email: string;
    subject: string;
    message: string;
    scheduledAt: any;
}

export default function CreateWorkflowModal({
    open,
    onClose,
    refresh,
    workflow
}: CreateWorkflowModalProps) {

    // basic validation, keeping it simple here
    const validationSchema = Yup.object({

        name: Yup.string()
            .required("Workflow name is required"),

        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),

        subject: Yup.string()
            .required("Subject is required"),

        message: Yup.string()
            .required("Message is required"),

    });


    const handleSubmit = async (
        values: WorkflowFormValues,
        helpers: FormikHelpers<WorkflowFormValues>
    ) => {

        const { resetForm, setSubmitting } = helpers;

        try {

            // decide create vs update based on presence of id
            if (workflow?._id) {

                await updateWorkflow(workflow._id, values);

                toast.success("Workflow updated");

            } else {

                await createWorkflow(values);

                toast.success("Workflow created");

            }

            refresh?.();

            resetForm();

            onClose();

        } catch (err) {

            toast.error("Operation failed");

        } finally {

            setSubmitting(false);

        }

    };


    // used to prevent selecting past datetime, timezone adjusted
    const getMinDateTime = () => {

        const now = new Date();

        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

        return now.toISOString().slice(0, 16);

    };


    return (

        <AnimatePresence>

            {open && (

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-backdrop"
                >

                    <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="modal-glass w-[420px]"
                    >

                        <h2 className="text-xl font-semibold mb-5">
                            {workflow ? "Edit Workflow" : "Create Workflow"}
                        </h2>


                        <Formik<WorkflowFormValues>

                            initialValues={{
                                name: workflow?.name || "",
                                email: workflow?.email || "",
                                subject: workflow?.subject || "",
                                message: workflow?.message || "",
                                scheduledAt: workflow?.scheduledAt || ""
                            }}

                            enableReinitialize

                            validationSchema={validationSchema}

                            onSubmit={handleSubmit}

                        >

                            {({ isSubmitting }) => (

                                <Form className="space-y-4">

                                    <div>

                                        <Field
                                            name="name"
                                            placeholder="Workflow Name"
                                            className="input"
                                        />

                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />

                                    </div>


                                    <div>

                                        <Field
                                            name="email"
                                            placeholder="Email"
                                            className="input"
                                        />

                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />

                                    </div>


                                    <div>

                                        <Field
                                            name="subject"
                                            placeholder="Subject"
                                            className="input"
                                        />

                                        <ErrorMessage
                                            name="subject"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />

                                    </div>


                                    <div>

                                        <Field
                                            as="textarea"
                                            name="message"
                                            placeholder="Message"
                                            className="input h-24 resize-none"
                                        />

                                        <ErrorMessage
                                            name="message"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />

                                    </div>


                                    <div>

                                        <p
                                            style={{
                                                fontSize: "11px",
                                                marginBottom: "8px"
                                            }}
                                        >
                                            Schedule Workflow (optional)
                                        </p>


                                        <Field name="scheduledAt">

                                            {({ field, form }: any) => (

                                                <input
                                                    type="datetime-local"
                                                    {...field}
                                                    min={getMinDateTime()}
                                                    className="input"
                                                    onChange={(e) => {

                                                        const selected = new Date(e.target.value);

                                                        const now = new Date();

                                                        // extra guard in case user manually enters invalid time
                                                        if (selected < now) {

                                                            toast.error("Past time not allowed");

                                                            form.setFieldValue("scheduledAt", "");

                                                            return;

                                                        }

                                                        form.setFieldValue("scheduledAt", e.target.value);

                                                    }}
                                                />

                                            )}

                                        </Field>


                                        <ErrorMessage
                                            name="scheduledAt"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />

                                    </div>


                                    <div className="flex justify-end gap-3 pt-4">

                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-primary"
                                        >

                                            {isSubmitting
                                                ? workflow
                                                    ? "Updating..."
                                                    : "Creating..."
                                                : workflow
                                                    ? "Update"
                                                    : "Create"}

                                        </button>

                                    </div>

                                </Form>

                            )}

                        </Formik>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>

    );

}