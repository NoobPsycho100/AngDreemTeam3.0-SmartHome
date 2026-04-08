import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { RoomTypeModel } from '../../api/generated';

export interface RoomsTypesData
{
    readonly status: 'not loaded' | 'loaded' | 'loading' | 'error';
    readonly types: RoomTypeModel[];
}

export const RoomsTypesStore = signalStore(
    { providedIn: 'root' },
    withState<RoomsTypesData>({ status: 'not loaded', types: [] }),
    withMethods((store) => ({
        setRoomTypes(types: RoomTypeModel[]){
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

