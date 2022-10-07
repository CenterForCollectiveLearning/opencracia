import {configureStore} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";

// create a slice 
export const users = createSlice({
  name: "users",
  initialState: {
    token: undefined
  },
  reducers:{
    updateToken(state, action) {
      state.token = action.payload;
    }
  }
});

export const screens = createSlice({
  name: "screens",
  initialState: {
    loading: false
  },
  reducers: {
    updateLoading(state) {
      state.loading = !state.loading;
    }
  }
});

export const properties = createSlice({
  name: "properties",
  initialState: {
    ballotSize: 2,
    data: [],
    dataChunks: [],
    subBallotPos: 0,
    module: "rank"
  },
  reducers: {
    updateBallotSize(state, action) {
      state.ballotSize = action.payload;
    },
    updateData(state, action) {
      state.data = action.payload;
    },
    updateDataChunks(state, action) {
      state.dataChunks = action.payload;
    },
    updateSubBallotPos(state, action) {
      state.subBallotPos = action.payload;
    }
  },
});

// config the store 
const store = configureStore({
  reducer: {
    properties: properties.reducer,
    screens: screens.reducer,
    users: users.reducer
  }
});

// export default the store 
export default store;

// export the action
// export const iconAction = iconslice.actions;