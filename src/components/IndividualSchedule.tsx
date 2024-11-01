"use client";
import { Day } from "@/app/interface/Day";
import { Schedule } from "@/app/interface/Schedule";
import { Color } from "@/app/interface/Color";
import path from "path";
interface Props {
  schedule: Schedule;
  days: (keyof Schedule)[];
  times: (keyof Day)[];
  mentorNames: string[];
  colorDictionary: Color[];
}
const IndividualSchedule = (props: Props) => {
  if (Object.values(props).some((v) => !v)) {
    return <p></p>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td></td>
            {props.days.map((day) => (
              <td key={day}>{day}</td>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.times.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {props.days.map((day) => renderTimeBlock(props.schedule, props.colorDictionary, day, time))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function renderTimeBlock(schedule: Schedule, colorDictionary: any, day: keyof Schedule, time: keyof Day) {
  //get the mentors who work that specific block
  const mentors = schedule[day][time];
  const width = 100;
  const height = 100;
  const percentage = .75;
  let mentorObjs;
  let pointA;
  let pointB;
  let pointC;
  let pointD;
  let pointE;
  let pointF;
  let arr1: Point[];
  let arr2: Point[];

  switch (mentors.length) {
    case 1:
      const mentorObj = getMentorDisplayInfo(0);
      return (
        <td>
          <svg width={width} height={height} style={{ backgroundColor: mentorObj.backgroundColor }}>
            {createText(width / 2, 0, height / 2, 0, mentors[0], 0)}
          </svg>
        </td>
      );
    case 2:
      mentorObjs = [0, 1].map((num) => getMentorDisplayInfo(num));
      //make the top left triangle
      pointA = new Point(0, 0);
      pointB = new Point(pointA.x + width, pointA.y);
      pointC = new Point(pointB.x - width, pointB.y + height);
      arr1 = [pointA, pointB, pointC];

      pointD = new Point(width, 0);
      pointE = new Point(pointD.x, height);
      pointF = new Point(pointE.x - width, pointE.y);
      arr2 = [pointD, pointE, pointF];
      return (
        <td>
          <svg width={width} height={height}>
            {createPath(arr1, mentorObjs[0].backgroundColor)}
            {createPath(arr2, mentorObjs[1].backgroundColor)}
            {createText(width / 2, -width / 2, height / 2, 0, mentors[0])}
            {createText(width / 2, -width / 2, height / 2, height * .4, mentors[1])}
          </svg>
        </td>
      );
    default:
      mentorObjs = [0, 1, 2].map((num) => getMentorDisplayInfo(num));

      pointA = new Point(0, 0);
      pointB = new Point(pointA.x + width * percentage, pointA.y);
      pointC = new Point(pointB.x - width * percentage, pointB.y + height * percentage);
      arr1 = [pointA, pointB, pointC];

      pointD = new Point(width, height);
      pointE = new Point(pointD.x, pointD.y - height * percentage);
      pointF = new Point(pointE.x - width * percentage, pointE.y + height * percentage);
      arr2 = [pointD, pointE, pointF];
      return (
        <td>
          <svg width={width} height={height} style={{backgroundColor: mentorObjs[1].backgroundColor}}>
            {createPath(arr1, mentorObjs[0].backgroundColor)}
            {createPath(arr2, mentorObjs[2].backgroundColor)}
            {createText(width / 2, -width / 2, height / 2, -height *.05, mentors[0])}
            {createText(width / 2, -width / 2, height / 2, height * .2, mentors[1])}
            {createText(width / 2, -width / 2, height / 2, height / 2, mentors[2])}
          </svg>
        </td>
      );
  }

  function getMentorDisplayInfo(index: number) {
    //colorObj should only be undefined iff the mentor name is "None"
    const colorObj = colorDictionary.find((obj: any) => obj.name === schedule[day][time][index]);
    const backgroundColor = colorObj?.color ?? "white";
    const color = colorObj?.dark ? "white" : "black";

    return { colorObj, backgroundColor, color };
  }
}

function createText(x: number, xOffset: number, y: number, yOffset: number, text: string, degree: number = -45) {
  return (
    <text fontSize={"12px"} x={x + xOffset} y={y + yOffset} style={{ textAnchor: "middle", dominantBaseline: "middle", transform: `rotate(${degree}deg)` }}>
      {text}
    </text>
  );
}

function createPath(points: Point[], fillColor: string) {
  return <path d={`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} z`} style={{ fill: fillColor }}></path>;
}

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
export default IndividualSchedule;
