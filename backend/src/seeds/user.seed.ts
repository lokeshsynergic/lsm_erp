import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

async function seedDatabase() {
  const app = await NestFactory.create(AppModule);
  const userRepository = app.get('UserRepository') as Repository<User>;

  try {
    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { user_id: 'admin' },
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      await app.close();
      return;
    }

    // Create admin user with pre-hashed password
    // Hash: $2b$10$s9EJrJrRevtGEGHHgdALvud7K49NGefkzwnaahOq.gtqoC2l.O6FG
    // Password: admin
    const adminUser = userRepository.create({
      user_id: 'admin',
      password: '$2b$10$s9EJrJrRevtGEGHHgdALvud7K49NGefkzwnaahOq.gtqoC2l.O6FG',
      usertype: 'A', // Admin type
      user_status: 'A', // Active
    });

    await userRepository.save(adminUser);
    console.log('✓ Admin user created successfully');
    console.log('  User ID: admin');
    console.log('  Password: admin');
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
  } finally {
    await app.close();
  }
}

seedDatabase();
