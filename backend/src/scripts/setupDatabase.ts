import { readFileSync } from "fs";
import { join } from "path";
import pool from "../config/database";

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");

    const schemaPath = join(__dirname, "../../..", "database", "schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    await pool.query(schema);

    console.log("✓ Database schema created successfully!");

    // Create default admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || "admin@extasy.asia";

    const existingAdmin = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail],
    );

    if (existingAdmin.rows.length === 0) {
      const bcrypt = require("bcryptjs");
      const passwordHash = await bcrypt.hash("admin123", 12);

      await pool.query(
        `INSERT INTO users (username, email, password_hash, is_verified, is_admin) 
         VALUES ($1, $2, $3, TRUE, TRUE)`,
        ["admin", adminEmail, passwordHash],
      );

      await pool.query(
        "INSERT INTO profiles (user_id) SELECT id FROM users WHERE email = $1",
        [adminEmail],
      );

      console.log("✓ Default admin user created!");
      console.log(`  Email: ${adminEmail}`);
      console.log("  Password: admin123");
      console.log("  ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!");
    }

    console.log("\n✅ Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
