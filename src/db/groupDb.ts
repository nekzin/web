import { Group } from './entity/Group.entity';
import AppDataSource from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';

/**
 * Получение групп
 * @returns Promise<GroupInterface[]>
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  // Инициализируем источник данных, если он еще не инициализирован
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const groupRepository = AppDataSource.getRepository(Group);
  const groups = await groupRepository.find({ relations: ['students'] });
  return groups as GroupInterface[];
};

/**
 * Добавление группы
 * @param groupFields поля группы
 * @returns Promise<GroupInterface>
 */
export const addGroupsDb = async (groupFields: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const groupRepository = AppDataSource.getRepository(Group);
  const group = new Group();
  const newGroup = await groupRepository.save({
    ...group,
    ...groupFields,
  });

  return newGroup;
};