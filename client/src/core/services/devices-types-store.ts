import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { DeviceTypeModel } from '../../api/generated';

export interface DeviceTypesData
{
    readonly status: 'not loaded' | 'loaded' | 'loading' | 'error';
    readonly types: DeviceTypeModel[];
}

export const DeviceTypesStore = signalStore(
    { providedIn: 'root' },
    withState<DeviceTypesData>({ status: 'not loaded', types: [] }),
    withMethods((store) => ({
        setDeviceTypes(types: DeviceTypeModel[]){
            patchState(store, { status: 'loaded', types: types });
        },
        setLoading(){
            patchState(store, { status: 'loading' });
        },
        setError(){
            patchState(store, { status: 'error' });
        }
    }))
);

