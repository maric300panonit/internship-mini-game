export class Button extends createjs.Container {
    private background: createjs.Shape;
    private label: createjs.Text;
    private onClickCallback: () => void; // <-- The callback function

    constructor(text: string, x: number, y: number, onClick: () => void) {
        super();

        this.x = x;
        this.y = y;
        this.onClickCallback = onClick; // <-- Store the callback

        // Create the button background
        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#007bff").drawRect(0, 0, 150, 40); 
        this.addChild(this.background);

        // Create the button label
        this.label = new createjs.Text(text, "20px Arial", "#ffffff");
        this.label.textAlign = "center";
        this.label.textBaseline = "middle";
        this.label.x = 75; // Center the text
        this.label.y = 20; // Center the text
        this.addChild(this.label);

        // Add interactivity
        this.cursor = "pointer"; // Change cursor on hover
        // Use 'this' as the scope to ensure handleClick runs in the Button's context
        this.on("click", this.handleClick, this); 
    }

    private handleClick(event: createjs.MouseEvent): void {
        console.log(`Button '${this.label.text}' clicked!`);
        // Execute the callback passed during construction
        if (this.onClickCallback) {
            this.onClickCallback();
        }
    }

    public getLabelWidth(): number {
        return this.label.getMeasuredWidth();
    }
}