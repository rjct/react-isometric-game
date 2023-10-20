import { degToRad, getHumanReadableDirection } from "@src/engine/helpers";

describe("getHumanReadableDirection()", () => {
  const tests = [
    { angle: 0, desiredResult: "left" },
    { angle: 1, desiredResult: "left" },
    { angle: 44, desiredResult: "left" },
    { angle: 316, desiredResult: "left" },
    { angle: 360, desiredResult: "left" },
    { angle: 720, desiredResult: "left" },

    { angle: 45, desiredResult: "top" },
    { angle: 90, desiredResult: "top" },
    { angle: 135, desiredResult: "top" },

    { angle: 136, desiredResult: "right" },
    { angle: 180, desiredResult: "right" },
    { angle: 225, desiredResult: "right" },

    { angle: 226, desiredResult: "bottom" },
    { angle: 270, desiredResult: "bottom" },
    { angle: 315, desiredResult: "bottom" },
  ];

  tests.forEach((testCase) => {
    test(`${testCase.angle}deg => ${testCase.desiredResult}`, () => {
      expect(
        getHumanReadableDirection({
          deg: testCase.angle,
          rad: degToRad(testCase.angle),
        }),
      ).toBe(testCase.desiredResult);
    });
  });
});
