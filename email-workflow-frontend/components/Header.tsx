"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { getConnectedEmail } from "@/lib/workflowApi";

export const Header = ({ setHistoryOpen, setOpen }: any) => {
    const [email, setEmail] = useState("");

    useEffect(() => {
        const loadEmail = async () => {
            try {
                const res: any = await getConnectedEmail();
                setEmail(res?.email || "--");
            } catch (err) {
                console.error("Failed to fetch connected email", err);
            }
        };

        loadEmail();
    }, []);

    const isDisconnected = email === "Not connected";

    return (
        <div
            className="
        header header-glass
        flex flex-col md:flex-row
        gap-3 md:gap-0
        justify-between
        items-start md:items-center
        px-3 md:px-8
        py-4 md:py-6
      "
            style={{ width: "100%" }}
        >
            {/* left side */}
            <div className="w-full md:w-auto">
                <h1
                    className="
            header-title
            text-2xl md:text-3xl
            font-bold
            mb-1 md:mb-2
          "
                >
                    Email Workflows
                </h1>

                <p
                    className="
            header-sub
            text-sm md:text-base
            text-gray-500
          "
                >
                    Manage your automated emails
                </p>
            </div>

            {/* right side */}
            <div
                className="
          header-actions
          flex flex-wrap gap-2 md:gap-4
          items-center
          w-full md:w-auto
          justify-start md:justify-end
          mt-3 md:mt-0
        "
            >
                <div className="email-badge whitespace-nowrap mb-2 md:mb-0">
                    <span
                        className={
                            isDisconnected ? "email-dot-red" : "email-dot"
                        }
                    />
                    <span className="truncate max-w-[120px] md:max-w-none">
                        {email}
                    </span>
                </div>

                <button
                    onClick={() => setHistoryOpen(true)}
                    className="btn btn-secondary"
                >
                    History
                </button>

                <ThemeToggle />

                <button
                    onClick={() => setOpen(true)}
                    className="btn btn-primary"
                >
                    Create Workflow
                </button>
            </div>
        </div>
    );
};