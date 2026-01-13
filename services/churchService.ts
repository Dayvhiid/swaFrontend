import api from './api';

export interface Zone {
    _id: string;
    name: string;
}

export interface Area {
    _id: string;
    name: string;
    zonalId: string;
}

export interface Parish {
    _id: string;
    name: string;
    areaId: string;
}

export const churchService = {
    getZones: async (): Promise<Zone[]> => {
        // Mock data as requested
        return [
            { _id: 'zone_1', name: 'Zone 1' },
            { _id: 'zone_2', name: 'Zone 2' },
            { _id: 'zone_3', name: 'Zone 3' }
        ];
    },

    getAreas: async (zonalId?: string): Promise<Area[]> => {
        // Mock data as requested
        return [
            { _id: 'area_1', name: 'Area 1', zonalId: zonalId || 'zone_1' },
            { _id: 'area_2', name: 'Area 2', zonalId: zonalId || 'zone_1' },
            { _id: 'area_3', name: 'Area 3', zonalId: zonalId || 'zone_1' }
        ];
    },

    getParishes: async (areaId?: string): Promise<Parish[]> => {
        // Mock data as requested
        return [
            { _id: 'parish_love', name: 'Love parish', areaId: areaId || 'area_1' },
            { _id: 'parish_hope', name: 'Hope parish', areaId: areaId || 'area_1' },
            { _id: 'parish_gentle', name: 'Gentle spirit parish', areaId: areaId || 'area_1' }
        ];
    }
};
