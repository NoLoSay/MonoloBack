import { UseGuards } from "@nestjs/common";
import { UserAuthGuard } from "../../guards/roles/user-auth.guard";

export const User = () => UseGuards(UserAuthGuard);
