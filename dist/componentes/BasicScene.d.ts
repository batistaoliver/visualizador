import { PureComponent } from 'react';
import { Object3D, Scene, Camera, Renderer } from 'three';
declare type Props = {
    width: string;
    height: string;
    onAnimate: Function;
    mesh: Object3D;
};
export default class BasicScene extends PureComponent<Props> {
    static defaultProps: {
        width: string;
        height: string;
        onAnimate: Function;
    };
    mount: HTMLDivElement;
    scene: Scene;
    camera: Camera;
    renderer: Renderer;
    frameId: number;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    start(): void;
    stop(): void;
    animate(): void;
    renderScene(): void;
    render(): JSX.Element;
}
export {};
