import { createContext } from 'react';
import type { ProjectContextValue } from './ProjectContext.types';

export const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);
