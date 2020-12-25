import { PureComponent } from 'react';
import { Object3D } from 'three';
declare type Props = {};
declare class Scene extends PureComponent<Props> {
    cube: Object3D;
    constructor(props: Props);
    onAnimate: () => void;
    render(): JSX.Element;
}
export default Scene;
