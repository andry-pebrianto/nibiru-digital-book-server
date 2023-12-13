import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { Admin } from "../../database/entities/Admin";
import { PostgreDataSource } from "../../database/data-source";

export default new (class AllSeeder {
  private readonly adminRepository: Repository<Admin> =
    PostgreDataSource.getRepository(Admin);

  async admin() {
    try {
      const adminData = await this.adminRepository.find();
      if (!adminData.length) {
        const passwordHashed = await bcrypt.hash("aswassaw", 10);

        const admin = new Admin();
        admin.id = uuidv4();
        admin.fullname = "Nibiru Digital Book Admin";
        admin.email = "admin@nibirudigitalbook.com";
        admin.password = passwordHashed;
        await this.adminRepository.save(admin);

        console.log("Seeder Admin Completed");
      }
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
})();
