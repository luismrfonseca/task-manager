import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from '@shared/index';
// import { UpdateUserDto } from './dto/update-user.dto'; // We might not need this yet

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDTO) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password!, // Note: Password should be hashed before calling this or inside this if we move hash logic here. For now assuming Auth service handles hash or we add it here.
        // Actually, best practice: Service handles hashing if it's "createUser".
        // But for Auth flow, AuthService usually hashes. Let's assume we receive hashed password or raw?
        // Let's take raw and hash it here? Or let AuthService do it?
        // Let's stick to simple: create receives data.
      },
    });
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updatePushToken(userId: string, pushToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { pushToken },
    });
  }
}
