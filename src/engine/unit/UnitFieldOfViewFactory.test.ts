import { UnitFieldOfViewFactory } from "@src/engine/unit/UnitFieldOfViewFactory";

describe("calculateRaysForSector()", () => {
  const props = {
    position: { x: 0, y: 0 },
    directionAngle: { deg: 0, rad: 0 },
    fieldOfView: { sectorAngle: 120, range: 10 },
  };

  const tests = [
    { props: { ...props, ...{ fieldOfView: { sectorAngle: 120, range: 10 } } }, desiredResult: 18 },
    { props: { ...props, ...{ fieldOfView: { sectorAngle: 20, range: 10 } } }, desiredResult: 4 },
  ];

  tests.forEach((testCase) => {
    test(`${JSON.stringify(testCase.props.fieldOfView)} => ${testCase.desiredResult}`, () => {
      const fieldOfView = new UnitFieldOfViewFactory(testCase.props);

      expect(fieldOfView.raysCount).toBe(testCase.desiredResult);
    });
  });
});
