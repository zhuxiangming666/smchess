import { checkerboard } from "../../config/variable";
import { IDirection, IPosition } from "../type";
import { PiecesManger } from "./pieces.ts";
import { INIT_PIECE_LIST } from "./pieces.ts/basePiece";
import { GunMountStartPos, SoldierStartPos,gridPos } from "./posconfig";

const BOARD_LINE_COLOR = 'black'; // 棋盘线条的颜色
const BOARD_LINE_WIDTH = 2;
const BOARD_RIVER_COLOR = 'yellow';
const ROW_COUNT = 8; // 纵8
const COLUMN_COUNT = 9; // 横9
const BOARD_WIDTH = checkerboard.boardWidth;
const BOARD_HEIGHT = checkerboard.boardHeight;
const SPECIAL_LINES_PENDING = 3; //  横折线条离主线条的长度
const SPECIAL_LINES_WIDTH = 2; // 横折线条的宽度
const SPECIAL_LINES_LONG = 7; // 横折线条的宽度


type CONTEXT_TYPE =  keyof CanvasRenderingContext2D;
class CanvasChess {
  private canvasContainer: HTMLDivElement;
  private canvasElement: HTMLCanvasElement;
  private context: CanvasRenderingContext2D; // canvas 的上下文对象
  private boardGridWidth: number; // 棋盘中网格的高宽
  private boardPaddingX: number; // 棋盘在canvas中的水平偏移量X
  private boardPaddingY: number; // 棋盘在canvas中的竖直偏移量Y
  private boardMinX: number; // 棋盘中最小的X坐标
  private boardMaxX: number; // 棋盘中最大的X坐标
  private boardMinY: number; // 棋盘中最小的Y坐标
  private boardMaxY: number; // 棋盘中最大的Y坐标

  private piecesList: PiecesManger | undefined;
  constructor(canvasDom:HTMLCanvasElement,container: HTMLDivElement){
    this.canvasElement = canvasDom;
    this.canvasContainer = container;
    this.context = canvasDom.getContext('2d') as CanvasRenderingContext2D;
    this.boardGridWidth = BOARD_HEIGHT/COLUMN_COUNT;
    this.boardPaddingX = (canvasDom.width - BOARD_WIDTH) / 2;
    this.boardPaddingY = (canvasDom.height - BOARD_HEIGHT) / 2;
    this.boardMinX = this.boardPaddingX;
    this.boardMaxX = canvasDom.width - this.boardPaddingX;
    this.boardMinY = this.boardPaddingY;
    this.boardMaxY = canvasDom.height - this.boardPaddingY;
    this.piecesList = undefined;
  }

  render() {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.drawBoardLine();
    this.drawPiecesList();
  }

  // 初始化棋子
  initPieces() {
    const { boardPaddingX,boardPaddingY,context: ctx} = this;
    this.piecesList = new PiecesManger({
      pieces: INIT_PIECE_LIST,
      boardInfo: {
        paddingX: boardPaddingX,
        paddingY: boardPaddingY,
        w: this.canvasElement.width,
        h: this.canvasElement.height
      }
    })
    this.piecesList.drawPieces();
    this.canvasContainer.appendChild(this.piecesList.canvas);
  }

  drawPiecesList() {
    if(!this.piecesList) return this.initPieces();
  }

  // 绘制棋盘的线条
  drawBoardLine(){
    const ctx = this.context;
    ctx.save();
    ctx.globalCompositeOperation = 'exclusion';
    ctx.beginPath();
    ctx.strokeStyle = BOARD_LINE_COLOR;
    ctx.lineWidth = BOARD_LINE_WIDTH;
    // 绘制横线
    let count = 0;
    while(count <= COLUMN_COUNT){
      const rightPos = this.boardMinY + count*this.boardGridWidth;
      this.context.moveTo(this.boardMinX,rightPos);
      ctx.lineTo(this.boardMaxX,rightPos);
      ctx.closePath();
      ctx.stroke();
      count ++;
    }
    // 绘制纵线
    count = 0;
    while(count <= ROW_COUNT){
      const bottomPos = this.boardMinX + count*this.boardGridWidth;
      ctx.moveTo(bottomPos,this.boardMinY);
      ctx.lineTo(bottomPos,this.boardMaxY);
      ctx.closePath();
      ctx.stroke();
      count ++;
    }
    ctx.stroke();

    // 编写楚河汉界
    ctx.beginPath();
    const {X: beginX,Y:beginY} = this.getCoordByPosition({X:0,Y:4});
    const RiverWidth = this.boardGridWidth;
    const RiverLong = BOARD_WIDTH;
    ctx.fillStyle = BOARD_RIVER_COLOR;
    ctx.clearRect(beginX,beginY,RiverLong,RiverWidth);
    ctx.rect(beginX,beginY,RiverLong,RiverWidth);
    ctx.fill();
    ctx.stroke();

    // 绘制棋盘的特色点
    const SpecialPoint = [...SoldierStartPos,...GunMountStartPos];
    SpecialPoint.forEach(item=>this.drawSpecialLines(item));
    this.drawSpecialLinesGrid();
    ctx.restore();
  }

  /**
   * @desc 绘制兵和炮初始的位置上的特熟标记
   * @params pos 位置的坐标系
  */
  private drawHorizontalFoldLine(pos:IPosition){
    const shortLineLong = 5; //绘制的横折线的长度
    const shortLineWidth = 1; // 绘制的横折线的粗细
    const shortLinePadding = 3;
    // 在两边的兵初始位置要只有一半的短线

  };
  // 通过棋子的位置获取到坐标
  private getCoordByPosition(pos:IPosition){
    const tmpX = this.boardMinX + pos.X * this.boardGridWidth;
    const tmpY = this.boardMinY + pos.Y * this.boardGridWidth;
    return {X:tmpX,Y:tmpY}
  }

  // 通过棋子的坐标获取到对应的位置
  private getPositionByCoord(pos: IPosition){
    // 根据点击的范围来判断坐标的位置
    return {X:0,y:0}
  }

  // 绘制特殊位置的横折线条
  private drawSpecialLines(posOut:IPosition){
    // 绘制点的canvas坐标
    const {X} = posOut;
    // 绘制点的真实坐标
    const pos = this.getCoordByPosition(posOut);
    const les :IPosition[][] = [];
    const leftTopPoint = this.getSpecialLinesPoint({X: pos.X - SPECIAL_LINES_PENDING, Y: pos.Y - SPECIAL_LINES_PENDING},IDirection.LEFT_TOP);
    const rightTopPoint = this.getSpecialLinesPoint({X: pos.X + SPECIAL_LINES_PENDING, Y: pos.Y - SPECIAL_LINES_PENDING},IDirection.RIGHT_TOP);
    const leftButtonPoint = this.getSpecialLinesPoint({X: pos.X - SPECIAL_LINES_PENDING, Y: pos.Y + SPECIAL_LINES_PENDING},IDirection.LEFT_DOWN);
    const rightButtonPoint = this.getSpecialLinesPoint({X: pos.X + SPECIAL_LINES_PENDING, Y: pos.Y + SPECIAL_LINES_PENDING},IDirection.RIGHT_DOWN);

    // 绘制一个方向上的线条函数
    const drawLineOneDirect = (points: IPosition[]) => {
      this.drawLine(points[0],points[1]);
      this.drawLine(points[0],points[2]);
    }

    if(X === 0){
      // 当x === 0 时候 不用绘制左边的横线
      les.push(rightButtonPoint,rightTopPoint);
    }else if(X === 8){
      // 当X 为 9 不用绘制右边的横折线条
      les.push(leftButtonPoint,leftTopPoint);
    }else{
      // x 不为 0 和不为 9 都要绘制
      les.push(rightButtonPoint,rightTopPoint,leftTopPoint,leftButtonPoint);
    }

    // 开始绘制特殊的横折线条
    les.forEach(item => drawLineOneDirect(item))


  }

  private drawSpecialLinesGrid(){
    const gridPosition = gridPos.map(item =>{
      return item.map(item => this.getCoordByPosition(item));
    });
    gridPosition.map(item => this.drawLine(item[0],item[1]));
  }

  private getSpecialLinesPoint (pos: IPosition,direction:IDirection){
    let returnArr:IPosition[] = [];
    let originPos = {X:0,Y:0};

    switch (direction) {
      case IDirection.LEFT_DOWN:
        originPos = {X: pos.X - SPECIAL_LINES_PENDING, Y: pos.Y + SPECIAL_LINES_PENDING};
        returnArr = [
          originPos,
          {X:originPos.X - SPECIAL_LINES_LONG,Y: originPos.Y},
          {X:originPos.X,Y: originPos.Y + SPECIAL_LINES_LONG}

      ];break;
      case IDirection.LEFT_TOP:
        originPos = {X: pos.X - SPECIAL_LINES_PENDING, Y: pos.Y - SPECIAL_LINES_PENDING};
        returnArr = [
          originPos,
          {X:originPos.X - SPECIAL_LINES_LONG,Y: originPos.Y},
          {X:originPos.X,Y: originPos.Y - SPECIAL_LINES_LONG}
        ];break;
        case IDirection.RIGHT_DOWN:
        originPos = {X: pos.X + SPECIAL_LINES_PENDING, Y: pos.Y + SPECIAL_LINES_PENDING};
        returnArr = [
          originPos,
          {X:originPos.X + SPECIAL_LINES_LONG,Y: originPos.Y},
          {X:originPos.X,Y: originPos.Y + SPECIAL_LINES_LONG}
        ];break;
        case IDirection.RIGHT_TOP:
        originPos = {X: pos.X + SPECIAL_LINES_PENDING, Y: pos.Y - SPECIAL_LINES_PENDING};
        returnArr = [
          originPos,
          {X:originPos.X + SPECIAL_LINES_LONG,Y: originPos.Y},
          {X:originPos.X,Y: originPos.Y - SPECIAL_LINES_LONG}
        ];break;
      default:
        break;
    }
      return returnArr;
  }
  /**
   * canvas 中绘制基本的图形
  */
  // canvas 绘制基本的类
  private drawLine(beginPos: IPosition,endPos: IPosition) {
    this.context.beginPath();
    this.context.moveTo(beginPos.X,beginPos.Y);
    this.context.lineTo(endPos.X,endPos.Y);
    this.context.stroke();
    this.context.closePath();
  }
}
export default CanvasChess;
