require("dotenv").config();

const fastify = require("fastify")({
    logger: true,
});

const { MongoClient, ObjectId } = require("mongodb");
const axios = require("axios");


// enable cors for frontend
fastify.register(require("@fastify/cors"), {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});


let db;


// start server and connect db
const startServer = async () => {

    try {

        const client = await MongoClient.connect(process.env.MONGO_URI);

        console.log("mongodb connected");

        db = client.db();

        await fastify.listen({ port: 4000 });

        console.log("server started on 4000");

    }
    catch (err) {

        console.error("db connection failed", err);

        process.exit(1);

    }

};

startServer();




// test route
fastify.get("/", async () => {

    return {
        status: "ok",
    };

});




// create workflow
fastify.post("/workflow", async (req) => {

    try {

        const data = req.body;

        const result = await db.collection("workflows").insertOne({

            name: data.name,

            email: data.email,

            subject: data.subject,

            message: data.message || "",

            scheduledAt: data.scheduledAt || null,

            createdAt: new Date(),

        });


        // trigger webhook if scheduled
        if (data.scheduledAt) {

            axios.post(process.env.N8N_WEBHOOK_URL, {

                email: data.email,

                subject: data.subject,

                message: data.message,

                scheduledAt: data.scheduledAt,

            });

        }


        return {

            success: true,

            id: result.insertedId,

        };

    }
    catch (err) {

        console.error("create workflow error", err);

        return {
            error: "Create failed",
        };

    }

});




// get workflows
fastify.get("/workflow", async (req, reply) => {

    try {

        const workflows = await db.collection("workflows").find().toArray();

        return reply.send(workflows);

    }
    catch (err) {

        console.error("fetch workflow error", err);

        return reply.code(500).send({
            error: "Fetch failed",
        });

    }

});




// run workflow
fastify.post("/workflow/:id/run", async (req) => {

    let workflow;

    try {

        workflow = await db.collection("workflows").findOne({

            _id: new ObjectId(req.params.id),

        });


        if (!workflow) {

            return {
                error: "not found",
            };

        }


        await axios.post(process.env.N8N_WEBHOOK_URL, {

            email: workflow.email,

            subject: workflow.subject,

            message: workflow.message,

            scheduledAt: workflow.scheduledAt,

        });



        await db.collection("executions").insertOne({

            workflowId: workflow._id.toString(),

            workflowName: workflow.name,

            email: workflow.email,

            subject: workflow.subject,

            status: "success",

            executedAt: new Date(),

        });


        return {

            success: true,

            message: "triggered",

        };

    }
    catch (err) {

        console.error("run error", err?.response?.data || err.message);


        await db.collection("executions").insertOne({

            workflowId: req.params.id,

            workflowName: workflow?.name || "Unknown",

            email: workflow?.email,

            subject: workflow?.subject,

            status: "failed",

            executedAt: new Date(),

        });


        return {
            error: "Trigger failed",
        };

    }

});




// delete workflow
fastify.delete("/workflow/:id", async (req) => {

    try {

        const result = await db.collection("workflows").deleteOne({

            _id: new ObjectId(req.params.id),

        });


        if (result.deletedCount === 0) {

            return {
                error: "not found",
            };

        }


        return {
            success: true,
        };

    }
    catch (err) {

        console.error("delete error", err);

        return {
            error: "Delete failed",
        };

    }

});




// update workflow
fastify.put("/workflow/:id", async (req) => {

    try {

        const { name, email, subject, message, scheduledAt } = req.body;


        await db.collection("workflows").updateOne(

            { _id: new ObjectId(req.params.id) },

            {
                $set: {

                    name,

                    email,

                    subject,

                    message,

                    scheduledAt: scheduledAt || null,

                },
            }

        );


        if (scheduledAt) {

            axios.post(process.env.N8N_WEBHOOK_URL, {

                email,

                subject,

                message,

                scheduledAt,

            });

        }


        return {
            success: true,
        };

    }
    catch (err) {

        console.error("update error", err);

        return {
            error: "Update failed",
        };

    }

});




// execution history
fastify.get("/executions", async (req, reply) => {

    try {

        const executions = await db
            .collection("executions")
            .find()
            .sort({ executedAt: -1 })
            .toArray();

        return reply.send(executions);

    }
    catch (err) {

        console.error("execution fetch error", err);

        return reply.code(500).send({
            error: "error",
        });

    }

});




// connected email
fastify.get("/settings/email", async () => {

    try {

        return {
            email: process.env.CONNECTED_EMAIL,
        };

    }
    catch (err) {

        console.error("email fetch error", err);

        return {
            error: "failed",
        };

    }

});