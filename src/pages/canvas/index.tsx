import React, { memo, useEffect, useRef } from 'react';
import styles from './index.module.less';
import { checkerboard } from '../../config/variable';
import CanvasChess from '../../classUitls/canvasChess';
const CANVAS_WIDTH = checkerboard.width;
const CANVAS_HEIGHT = checkerboard.height;



function Chess() {
  const canvasHTMLRef = useRef<HTMLCanvasElement>() as React.MutableRefObject<HTMLCanvasElement>
  const canvasContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>
  const canvasChessRef = useRef<CanvasChess>() as React.MutableRefObject<CanvasChess>
  // 初始化
  useEffect(() => {
    if(!canvasHTMLRef.current || !canvasContainerRef.current) return;
    canvasChessRef.current = new CanvasChess(canvasHTMLRef.current,canvasContainerRef.current);
    canvasChessRef.current.render();
  }, [])

  return (
    <div className={styles.canvasContainer} ref={canvasContainerRef}>
      <canvas ref={canvasHTMLRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
    </div>
  )
}

export default memo(Chess);
