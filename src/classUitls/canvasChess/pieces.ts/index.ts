import { BasePiece, PieceProps, RenderPiecesProps } from "./basePiece";
import { GeneralPiece } from "./generalPiece";


export interface IBoardInfo {
  paddingX: number
  paddingY: number
  w: number,
  h: number,
}
export class PiecesManger {
  private piecesList: BasePiece[];
  private ctx: CanvasRenderingContext2D;
  private boardInfo: IBoardInfo;

  canvas: HTMLCanvasElement;
  constructor(props: {
    pieces: PieceProps[],
    boardInfo: IBoardInfo,
  }){
    const { pieces,boardInfo } = props;
    this.boardInfo = boardInfo;
    const {w,h} = boardInfo;
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.canvas.style.background = 'background:rgba(255,255,255,0)';
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0px';
    this.canvas.style.top = '0px';

    // this.canvas.style.background = 'background:rgba(255,255,255,0);';


    this.piecesList = pieces.map(i=>{
      return new GeneralPiece({
        basePiece: i,
      });
    });
  }

  drawPieces () {
    const { paddingX,paddingY,w,h} = this.boardInfo;
    this.ctx.save();
    this.ctx.translate(paddingX,paddingY);
    this.piecesList.forEach(i=>i.render(this.ctx,{
      boardWidth: w - 2* paddingX,
      boardHeight: h - 2 * paddingY,
      color: ''
    }));
    this.ctx.restore();
    return this.ctx.getImageData(0,0,2 * paddingX + w, 2 * paddingY + h);
  }
}
