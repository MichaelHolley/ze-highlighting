export interface RouteConfiguration {
  dataKey: string;
  classId: string;
  columnIndex: number;
  descriptionColumIndex?: number;
}

export const StdAnzeigeConfig: RouteConfiguration = {
  dataKey: "data-lfdnr",
  classId: " ",
  columnIndex: 7,
  descriptionColumIndex: 5
};

export const StdErfassungConfig: RouteConfiguration = {
  dataKey: "data-me",
  classId: "me-",
  columnIndex: 6,
  descriptionColumIndex: 11
};
