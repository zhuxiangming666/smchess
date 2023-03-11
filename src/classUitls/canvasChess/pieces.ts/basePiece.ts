import { count } from 'console';
import { IPosition } from './pieces';

export interface PieceProps {
    id: number,
    text: string,
    position: IPosition,
}
const BOARD_GRID = {
  countX: 8,
  countY: 9,
}

export interface RenderPiecesProps {
  boardWidth: number;
  boardHeight: number;
  color: string;
}



export const INIT_PIECE_LIST = [
  {
    id: 0,
    text: '将',
    position: {x:4, y: 0}
  },
  {
    id: 1,
    text: '帥',
    position: {x:4, y: 0}
  },
  {
    id: 2,
    text: '仕',
    position: {x:3, y: 0}
  },
  {
    id: 3,
    text: '士',
    position: {x:3, y: 0}
  },
  {
    id: 4,
    text: '仕',
    position: {x:5, y: 0}
  },
  {
    id: 5,
    text: '士',
    position: {x:5, y: 0}
  },
  {
    id: 6,
    text: '象',
    position: {x:2, y: 0}
  },
  {
    id: 7,
    text: '相',
    position: {x:2, y: 0}
  },
  {
    id: 8,
    text: '象',
    position: {x:6, y: 0}
  },
  {
    id: 9,
    text: '相',
    position: {x:6, y: 0}
  },
  {
    id: 10,
    text: '马',
    position: {x:1, y: 0}
  },
  {
    id: 11,
    text: '马',
    position: {x:1, y: 0}
  },
  {
    id: 12,
    text: '马',
    position: {x:7, y: 0}
  },
  {
    id: 13,
    text: '马',
    position: {x:7, y: 0}
  },
  {
    id: 14,
    text: '车',
    position: {x:0, y: 0}
  },
  {
    id: 15,
    text: '车',
    position: {x:0, y: 0}
  },
  {
    id: 16,
    text: '车',
    position: {x:8, y: 0}
  },
  {
    id: 17,
    text: '车',
    position: {x:8, y: 0}
  },
  {
    id: 18,
    text: '炮',
    position: {x:7, y: 2}
  },
  {
    id: 19,
    text: '炮',
    position: {x:7, y: 2}
  },
  {
    id: 20,
    text: '炮',
    position: {x:1, y: 2}
  },
  {
    id: 21,
    text: '炮',
    position: {x:1, y: 2}
  },
  {
    id: 22,
    text: '卒',
    position: {x:0, y: 3}
  },
  {
    id: 23,
    text: '兵',
    position: {x:0, y: 3}
  },
  {
    id: 24,
    text: '卒',
    position: {x:2, y: 3}
  },
  {
    id: 25,
    text: '兵',
    position: {x:2, y: 3}
  },
  {
    id: 26,
    text: '卒',
    position: {x:4, y: 3}
  },
  {
    id: 27,
    text: '兵',
    position: {x:4, y: 3}
  },
  {
    id: 28,
    text: '卒',
    position: {x:6, y: 3}
  },
  {
    id: 29,
    text: '兵',
    position: {x:6, y: 3}
  },
  {
    id: 30,
    text: '卒',
    position: {x:8, y: 3}
  },
  {
    id: 31,
    text: '兵',
    position: {x:8, y: 3}
  }
];

// const RED_CHESS_Box = [];

export class BasePiece {
  private isAlive: boolean;
  id: number;
  text: string;
  position: IPosition;
  constructor({
    id,
    text,
    position,
  }: PieceProps){
    this.isAlive = true;
    this.id = id;
    this.text = text;
    this.position = position;
  }

  render (ctx: CanvasRenderingContext2D,renderProps: RenderPiecesProps) {
    if(!this.isAlive) return;
    const {x,y,pieceRadius: r,fontSize,flagColor} = this.getPieceInfo(renderProps);

    ctx.save();
    // 偶数为黑棋,奇数为红棋子
    if(this.judgeFlag()) {
      ctx.translate(renderProps.boardWidth,renderProps.boardHeight);
      ctx.rotate(Math.PI);
    }
    // TODO: 添加旋转用于绘制两边的棋子
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      r.inner,
      0,
      Math.PI * 2, true);
    ctx.moveTo(x + r.outer,y);
    ctx.fillStyle = 'rgba(237,223,212,1)';
    ctx.arc(
      x,y,r.outer,0, Math.PI * 2, true,
    );
    ctx.fill();
    ctx.stroke();

    // TODO: 棋子padding 颜色

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(Math.PI);
    ctx.font = `${fontSize}px 微软雅黑`;
    ctx.fillStyle = flagColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = 'center';
    ctx.fillText(this.text,0 ,0 );
    ctx.restore();
    //
    ctx.restore();
  }

  private getPieceInfo({boardHeight,boardWidth}: RenderPiecesProps) {
    const oneGridWidth = boardWidth / BOARD_GRID.countX;
    const oneGridHeight = boardHeight / BOARD_GRID.countY;

    const minRadius = Math.min(oneGridWidth,oneGridHeight);

    return {
      x: this.position.x * oneGridWidth,
      y: this.position.y * oneGridHeight,
      pieceRadius: {
        outer: minRadius * 0.3,
        inner: minRadius * 0.2
      },
      fontSize: Math.ceil(minRadius * 0.3),
      flagColor: this.judgeFlag() ? 'red': 'black',
    }
  }

  judgeFlag() {
    return this.id % 2;
  }
}
