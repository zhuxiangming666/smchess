import { BasePiece, PieceProps, RenderPiecesProps } from "./basePiece";

export class SoldierPiece extends BasePiece {
  constructor (props: {
    basePiece: PieceProps,
  }) {
    super(props.basePiece);
  }

  drawPiece(ctx: CanvasRenderingContext2D, renderProps: RenderPiecesProps): void {
      this.render(ctx,renderProps);
  }
}
