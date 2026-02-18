
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as services from '@/db/services';
import type {
    User as DbUser,
    Note as DbNote,
    Patient as DbPatient,
    UserSettings as DbSettings
} from '@/db/schema';
import { dbNoteToAppNote, dbUserToAppUser } from '@/db/services';
import { toast } from 'sonner';

// Query Keys
export const userKeys = {
    all: ['users'] as const,
    currentUser: (email: string) => [...userKeys.all, 'current', email] as const,
    settings: (userId: string) => [...userKeys.all, 'settings', userId] as const,
};

export const noteKeys = {
    all: ['notes'] as const,
    lists: () => [...noteKeys.all, 'list'] as const,
    list: (userId: string) => [...noteKeys.lists(), userId] as const,
    details: () => [...noteKeys.all, 'detail'] as const,
    detail: (id: string) => [...noteKeys.details(), id] as const,
    search: (userId: string, query: string) => [...noteKeys.all, 'search', userId, query] as const,
};

export const dashboardKeys = {
    all: ['dashboard'] as const,
    stats: (userId: string) => [...dashboardKeys.all, 'stats', userId] as const,
    trends: (userId: string) => [...dashboardKeys.all, 'trends', userId] as const,
    activity: (userId: string) => [...dashboardKeys.all, 'activity', userId] as const,
};

export const patientKeys = {
    all: ['patients'] as const,
    lists: () => [...patientKeys.all, 'list'] as const,
    list: (userId: string) => [...patientKeys.lists(), userId] as const,
    details: () => [...patientKeys.all, 'detail'] as const,
    detail: (id: string) => [...patientKeys.details(), id] as const,
};

// User Hooks
export function useCurrentUser(email: string | undefined) {
    return useQuery({
        queryKey: userKeys.currentUser(email || ''),
        queryFn: async () => {
            if (!email) return null;
            const user = await services.getUserByEmail(email);
            return user ? dbUserToAppUser(user) : null;
        },
        enabled: !!email,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useUserSettings(userId: string | undefined) {
    return useQuery({
        queryKey: userKeys.settings(userId || ''),
        queryFn: async () => {
            if (!userId) return null;
            return await services.getUserSettings(userId);
        },
        enabled: !!userId,
    });
}

export function useUpdateUserSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, settings }: { userId: string, settings: Partial<DbSettings> }) => {
            return await services.createOrUpdateUserSettings(userId, settings);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(userKeys.settings(variables.userId), data);
            toast.success('Settings saved');
        },
        onError: (error) => {
            console.error('Failed to update settings', error);
            toast.error('Failed to save settings');
        }
    });
}

// Note Hooks
export function useNotes(userId: string | undefined) {
    return useQuery({
        queryKey: noteKeys.list(userId || ''),
        queryFn: async () => {
            if (!userId) return [];
            const notes = await services.getNotesByUserId(userId);
            return notes.map(dbNoteToAppNote);
        },
        enabled: !!userId,
        staleTime: 1000 * 60, // 1 minute
    });
}

export function useNote(id: string | undefined) {
    return useQuery({
        queryKey: noteKeys.detail(id || ''),
        queryFn: async () => {
            if (!id) return null;
            const note = await services.getNoteById(id);
            return note ? dbNoteToAppNote(note) : null;
        },
        enabled: !!id,
    });
}

export function useCreateNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (noteData: Parameters<typeof services.createNote>[0]) => {
            const note = await services.createNote(noteData);
            return note ? dbNoteToAppNote(note) : null;
        },
        onSuccess: (newNote) => {
            if (newNote) {
                // Invalidate list to refresh
                queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
                toast.success('Note created successfully');
            }
        },
        onError: (error) => {
            toast.error('Failed to create note');
            console.error(error);
        }
    });
}

export function useUpdateNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: Partial<Parameters<typeof services.createNote>[0]> }) => {
            const note = await services.updateNote(id, updates);
            return note ? dbNoteToAppNote(note) : null;
        },
        onSuccess: (updatedNote) => {
            if (updatedNote) {
                queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
                queryClient.invalidateQueries({ queryKey: noteKeys.detail(updatedNote.id) });
                toast.success('Note updated');
            }
        },
    });
}

export function useDeleteNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await services.deleteNote(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
            toast.success('Note deleted');
        }
    });
}

// Dashboard Hooks
export function useDashboardStats(userId: string | undefined) {
    return useQuery({
        queryKey: dashboardKeys.stats(userId || ''),
        queryFn: async () => {
            if (!userId) return null;
            return await services.getDashboardStats(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useVisitTrends(userId: string | undefined, days: number = 30) {
    return useQuery({
        queryKey: [...dashboardKeys.trends(userId || ''), days],
        queryFn: async () => {
            if (!userId) return [];
            return await services.getVisitTrends(userId, days);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useRecentActivity(userId: string | undefined, limit: number = 10) {
    return useQuery({
        queryKey: [...dashboardKeys.activity(userId || ''), limit],
        queryFn: async () => {
            if (!userId) return [];
            return await services.getRecentActivity(userId, limit);
        },
        enabled: !!userId,
        staleTime: 1000 * 60, // 1 minute
    });
}

// Patient Hooks
export function usePatients(userId: string | undefined) {
    return useQuery({
        queryKey: patientKeys.list(userId || ''),
        queryFn: async () => {
            if (!userId) return [];
            return await services.getPatientsByUserId(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCreatePatient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (patientData: Parameters<typeof services.createPatient>[0]) => {
            return await services.createPatient(patientData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
            toast.success('Patient added successfully');
        },
        onError: () => toast.error('Failed to add patient')
    });
}
