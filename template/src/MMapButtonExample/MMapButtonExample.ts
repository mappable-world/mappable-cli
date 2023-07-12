import type {MMapControlButton, MMapControlButtonProps} from '@mappable-world/mappable-types';

interface MMapButtonExampleProps extends MMapControlButtonProps {
    className?: string;
}

export class MMapButtonExample extends mappable.MMapComplexEntity<MMapButtonExampleProps> {
    private _button?: MMapControlButton;
    private _element: HTMLElement = document.createElement('div');

    constructor(props: MMapButtonExampleProps) {
        super(props);
        this._element.classList.add(this._props.className);
    }

    protected _onAttach() {
        this._button = new mappable.MMapControlButton({...this._props, element: this._element});
        this.addChild(this._button);
    }

    protected _onUpdate(props: Partial<MMapButtonExampleProps>, oldProps: MMapButtonExampleProps) {
        this._button.update(props);

        if (props.className !== undefined) {
            this._element.classList.remove(oldProps.className);
            this._element.classList.add(props.className);
        }
    }

    protected _onDetach() {
        this.removeChild(this._button);
    }
}
