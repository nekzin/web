import { Group } from './entity/Group.entity';
import AppDataSource from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';

// Безопасное получение репозитория с инициализацией при необходимости
const getGroupRepo = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(Group);
};

/**
 * Получение групп
 * @returns Promise<GroupInterface[]>
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const repo = await getGroupRepo();
  return await repo.find();
};

/**
 * Добавление группы
 * @returns Promise<GroupInterface>
 */
export const addGroupsDb = async (
  groupFields: Omit<GroupInterface, 'id'>
): Promise<GroupInterface> => {
  const repo = await getGroupRepo();
  const group = repo.create(groupFields);
  return await repo.save(group);
};