import { GenericService } from "src/common/services/generic.service";
import { Category } from "../entities/category.entity";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";
import { CategoryStatus } from "../enums/category-status.enum";
import { BadRequestException, NotFoundException } from "@nestjs/common";


export class CategoryService extends GenericService<Category> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {
        super(dataSource, Category, 'category');
    }


    // Example validation in your service
    async isCategoryActive(category: Category): Promise<boolean> {
        if (!category.isActive) return false;
        if (!category.isTimeRestricted) return true;

        const now = new Date();
        // Convert current time to minutes since midnight for comparison
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Convert category time restrictions to minutes since midnight
        const startMinutes = this.timeToMinutes(category.activeTimeStart);
        const endMinutes = this.timeToMinutes(category.activeTimeEnd);

        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

        const isTimeValid = currentMinutes >= startMinutes &&
            currentMinutes <= endMinutes;

        const isDayValid = category.activeDays.includes(currentDay);

        return isTimeValid && isDayValid;
    }

    private timeToMinutes(time: Date): number {
        return time.getHours() * 60 + time.getMinutes();
    }

    async validateAssignParentCategory(category: Category, parentCategory: Category) {

        if (!category) {
            throw new NotFoundException('Catégorie non trouvée');
        }
        if (!parentCategory) {
            throw new NotFoundException('Catégorie parente non trouvée');
        }

        if (parentCategory.id === category.id) {
            throw new BadRequestException('Une catégorie ne peut être sa propre catégorie parente');
        }

        if (category.id === parentCategory.parentCategoryId) {
            throw new BadRequestException('Référence circulaire détectée - ne peut créer une boucle de catégorie');
        }
    }

    async assignParentCategory(category: Category, parentCategory: Category) {
        await this.validateAssignParentCategory(category, parentCategory);
        if (category.parentCategoryId === parentCategory.id) {
            return;
        }
        category.parentCategory = parentCategory;
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        await this.validateUnique({
            categoryCode: createCategoryDto.categoryCode,
            categoryName: createCategoryDto.categoryName,
        });

        const category = this.categoryRepository.create(createCategoryDto);

        if (createCategoryDto.parentCategoryId) {
            const parentCategory = await this.findById(createCategoryDto.parentCategoryId);
            await this.assignParentCategory(category, parentCategory);
        }

        return await this.categoryRepository.save(category);
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {

        if (updateCategoryDto.categoryCode) {
            await this.validateUniqueExcludingSelf({
                categoryCode: updateCategoryDto.categoryCode
            }, id);
        }

        if (updateCategoryDto.categoryName) {
            await this.validateUniqueExcludingSelf({
                categoryName: updateCategoryDto.categoryName
            }, id);
        }

        const category = await this.findOneByIdWithOptions(id);

        if ('parentCategoryId' in updateCategoryDto) {
            if (!updateCategoryDto.parentCategoryId) {
                category.parentCategory = null;
            }

            if (updateCategoryDto.parentCategoryId) {
                const parentCategory = await this.findOneByIdWithOptions(updateCategoryDto.parentCategoryId);
                await this.assignParentCategory(category, parentCategory);
            }
        }

        Object.assign(category, updateCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async deleteCategory(id: string) {
        const category = await this.findOneByIdWithOptions(id);
        if (await this.countByAttribute({ parentCategoryId: id })) {
            throw new BadRequestException('La catégorie a des sous-catégories et ne peut être supprimée');
        }
        return await this.categoryRepository.softDelete(id);
    }
}
