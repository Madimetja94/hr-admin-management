# hr-admin-management
Setup Instructions
1. Clone the repository:

    git clone https://github.com/Madimetja94/hr-admin-management
    cd hr-admin-system

2. Install dependencies:

    npm install

3. Configure environment variables:
Create a .env file in the project root with the following contents:

    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your_secret_key"

4. Push Prisma schema to the database:

    npx prisma db push

5. Run database migrations and seeding:

    npx prisma migrate dev --name init

6. Generate Prisma client:

    npx prisma generate
    
7. Seed the database:

    npm run seed

8. Start the development server:

    npm run dev