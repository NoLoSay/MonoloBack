import { Reflector } from '@nestjs/core';

export const ADMIN = "ADMIN";
export const USER = "USER";
export const CREATOR = "CREATOR";
export const REFERENT = "REFERENT";
export const MODERATOR = "MODERATOR";

export const Roles = Reflector.createDecorator<string[]>();