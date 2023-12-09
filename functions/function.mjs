import { neon } from "@neondatabase/serverless";
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not defined");
}

const sql = neon(databaseUrl);

exports.handler = async function (event, context) {
	try {
		const postId = parseInt(event.queryStringParameters.postId, 10);

		const result = await sql("SELECT * FROM posts WHERE id = $1", [postId]);

		if (!result || result.length === 0) {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: "Post not found" }),
			};
		}

		const post = result[0];

		return {
			statusCode: 200,
			body: JSON.stringify(post),
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Internal Server Error" }),
		};
	}
};
