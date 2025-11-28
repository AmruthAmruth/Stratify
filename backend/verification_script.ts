

import mongoose from "mongoose";
import dotenv from "dotenv";

import { GenerateDailyStandupsUseCase } from "./src/application/use-cases/meeting/GenerateDailyStandupsUseCase";
import { MeetingRepository } from "./src/infrastructure/repositories/MeetingRepository";
import { ProjectRepository } from "./src/infrastructure/repositories/ProjectRepository";
import { NotificationRepository } from "./src/infrastructure/repositories/NotificationRepository";

import { SocketService } from "./src/shared/services/SocketService";

dotenv.config();

async function main() {
  console.log("──────────────────────────────────────");
  console.log("🔍 Verification Script: Daily Standups");
  console.log("──────────────────────────────────────\n");

  try {
    console.log("⏳ Connecting to MongoDB...");

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ Missing MONGO_URI in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to DB\n");

    SocketService.setIO({
      to: (id: string) => ({
        emit: (event: string, payload: any) => {
          console.log(`📡 [MockSocket] -> ${id} | ${event}`);
          console.log(payload);
        },
      }),
    } as any);

    console.log("⚙ Creating use-case instance...");
    const useCase = new GenerateDailyStandupsUseCase(
      new MeetingRepository(),
      new ProjectRepository(),
      new NotificationRepository()
    );

    console.log("🚀 Executing use-case...\n");

    await useCase.execute();

    console.log("\n🎉 Verification completed successfully!");

  } catch (error) {
    console.error("\n❌ Verification failed:");
    console.error(error);
  } finally {
    console.log("\n🔌 Disconnecting DB...");
    await mongoose.disconnect();
    console.log("✔ DB disconnected");

    process.exit(0);
  }
}

main();
