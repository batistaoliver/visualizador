import React, { ChangeEvent } from 'react';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import './Main.css';
import { Object3D } from 'three';
declare type State = {
    mesh: Object3D | null;
};
export default class Main extends React.PureComponent<{}, State> {
    loader: PCDLoader;
    constructor(props: {});
    onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
    onLoad: (mesh: Object3D) => void;
    onLoadProgress: (xhr: ProgressEvent) => void;
    onLoadError: (error: ErrorEvent) => void;
    render(): JSX.Element;
}
export {};
