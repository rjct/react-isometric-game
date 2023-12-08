export async function generateClipPath(
  assetImageUrl: HTMLImageElement,
  spriteSize: Size2D,
  shiftX: number,
  shiftY: number,
): Promise<string> {
  const { width, height } = spriteSize;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(assetImageUrl, shiftX * width, shiftY * height, width, height, 0, 0, width, height);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(generateClipPathForNonTransparentEdges(ctx.getImageData(0, 0, width, height)));
    });
  });
}

function generateConvexHull(points: GridCoordinates[]): GridCoordinates[] {
  if (points.length <= 3) {
    return points;
  }

  const getOrientation = (p: GridCoordinates, q: GridCoordinates, r: GridCoordinates): number => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) return 0;

    return val > 0 ? 1 : 2;
  };

  const sortByPolarAngle = (a: GridCoordinates, b: GridCoordinates): number => {
    const orientation = getOrientation(points[0], a, b);

    if (orientation === 0) {
      return Math.hypot(a.x - points[0].x, a.y - points[0].y) - Math.hypot(b.x - points[0].x, b.y - points[0].y);
    }

    return orientation === 2 ? -1 : 1;
  };

  points.sort(sortByPolarAngle);

  const stack: GridCoordinates[] = [];
  stack.push(points[0]);

  for (let i = 2; i < points.length; i++) {
    let top = stack.length - 1;

    while (top >= 1 && getOrientation(stack[top - 1], stack[top], points[i]) !== 2) {
      stack.pop();
      top = stack.length - 1;
    }

    stack.push(points[i]);
  }

  return stack;
}

function crossProduct(p1: GridCoordinates, p2: GridCoordinates, p3: GridCoordinates): number {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
}

function expandConvexHull(convexHull: GridCoordinates[], N: number): GridCoordinates[] {
  const expandedHull: GridCoordinates[] = [];

  for (let i = 0; i < convexHull.length; i++) {
    const currentPoint = convexHull[i];
    const nextPoint = convexHull[(i + 1) % convexHull.length];

    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const expandedCurrentPoint: GridCoordinates = {
      x: currentPoint.x + unitY * N,
      y: currentPoint.y - unitX * N,
    };

    const expandedNextPoint: GridCoordinates = {
      x: nextPoint.x + unitY * N,
      y: nextPoint.y - unitX * N,
    };

    let j = expandedHull.length;

    while (j >= 2 && crossProduct(expandedHull[j - 2], expandedHull[j - 1], expandedCurrentPoint) <= 0) {
      expandedHull.pop();
      j--;
    }

    expandedHull.push(expandedCurrentPoint);

    j = expandedHull.length;

    while (j >= 2 && crossProduct(expandedHull[j - 2], expandedHull[j - 1], expandedNextPoint) <= 0) {
      expandedHull.pop();
      j--;
    }

    if (i !== convexHull.length - 1) expandedHull.push(expandedNextPoint);
  }

  return expandedHull;
}

function generateClipPathForNonTransparentEdges(imageData: ImageData): string {
  const { width, height, data } = imageData;

  const isOpaque = (x: number, y: number): boolean => {
    const alpha = data[(y * width + x) * 4 + 3];

    return alpha > 1;
  };

  const edgePoints: GridCoordinates[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isOpaque(x, y)) {
        edgePoints.push({ x, y });
      }
    }
  }

  const convexHull = generateConvexHull(edgePoints);
  const expandedConvexHull = expandConvexHull(convexHull, 5);

  const clipPath: string[] = [];

  for (const { x, y } of expandedConvexHull) {
    clipPath.push(`${x}px ${y}px`);
  }

  return `polygon(${clipPath.join(", ")})`;
}
