import { useQuery } from '@tanstack/react-query';
import { getAllAsync } from '../../dashboards/DashboardsRepository';

export default function useDashboards() {
    return useQuery(['dashboards'], getAllAsync, {
        staleTime: 60*1000 // 1min
    });
}