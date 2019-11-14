import React from 'react';
import globalHook, { Store } from 'use-global-hook';

export type UiState = {
  isAppTourActive: boolean;
};

export type UiActions = {
  toggleAppTour: () => void;
};

const initialState: UiState = {
  isAppTourActive: false,
};

const actions = {
  toggleAppTour: (store: Store<UiState, UiActions>) => {
    store.setState({ isAppTourActive: !store.state.isAppTourActive });
  },
};

export const useGlobal = globalHook<UiState, UiActions>(
  React,
  initialState,
  actions,
);
