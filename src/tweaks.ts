// CONSTANTS
const shortDaysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const fullDaysOfWeek = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];
const oneDay = 86400000;
// config for todo highlighting
const todoHightlightColor = "lightyellow";
// keyword must be all lowercase!
const highlightKeyword = "todo";

export const highlightedProjectsId = "highlightedProjects";

// class where the table containing the bookings starts
const bookingTableId = "std-buchungen-body";
// duration element class in table
const duractionClass = ".td-dauer";
const durationValueClass = ".val-show";

export const initTweaks = () => {
  // FUNCTIONS
  const calculateDailyWorkingHours = () => {
    function calculateDuration(elements: Array<Element>): number {
      let currentDuration = 0.0;
      for (const child of elements) {
        const durationElement = child.querySelector(duractionClass);
        if (!durationElement) {
          return 0;
        }

        const durationValueElement =
          durationElement.querySelector(durationValueClass);
        if (!durationValueElement) {
          return 0;
        }

        const floatString = durationValueElement.textContent?.replace(",", ".");
        if (!floatString) {
          continue;
        }
        const floatValue = Number.parseFloat(floatString);
        currentDuration += floatValue;
      }

      return currentDuration;
    }

    function createDurationElementIfNotExisting(
      header: Element,
      duration: number
    ) {
      if (header.querySelector(".th-duration")) {
        return;
      }

      const element = document.createElement("span");
      element.classList.add("th-duration");
      element.setAttribute(
        "style",
        "font-weight:bold;width:35px;line-height: unset;"
      );

      const displayDuration = duration == null ? "?" : duration;
      element.innerText = `  ${displayDuration} Std`;

      header.children[0].appendChild(element);
    }

    const table = document.getElementById(bookingTableId);
    if (!table) {
      return;
    }

    let header: Element | undefined;
    let children = Array<Element>();
    let duration = 0.0;
    for (const row of table.children) {
      // header element of days has no id
      if (row.id === "") {
        if (children.length !== 0) {
          duration = calculateDuration(children);

          if (header) {
            createDurationElementIfNotExisting(header, duration);
          }
        }

        header = row;
        children = [];
      } else {
        children.push(row);
      }
    }

    duration = calculateDuration(children);
    if (header) {
      createDurationElementIfNotExisting(header, duration);
    }
  };

  const highlightTodoComments = () => {
    // get all comments (div elements)
    const commentNodes = Array(
      ...document.getElementsByClassName("readmore-text")
    );

    const todoNodes = commentNodes.filter((node) =>
      node.textContent?.toLowerCase().includes(highlightKeyword)
    );

    for (const node of todoNodes) {
      findAndHighlightContainingTableRow(node, todoHightlightColor);
    }
  };

  const findAndHighlightContainingTableRow = (node: Element, color: string) => {
    const todoTds = [];
    // get tr
    const tr = node.closest("tr");
    if (!tr) {
      return;
    }
    // get all columns in table row
    todoTds.push(...tr.children);

    // override the background-color of all columns
    for (const todoTd of todoTds) {
      todoTd.setAttribute("style", `background-color: ${color}`);
    }
  };

  const updateStartDate = () => {
    const insertFrom = document.getElementById(
      "insert-von"
    ) as HTMLInputElement | null;
    const insertUntil = document.getElementById(
      "insert-bis"
    ) as HTMLInputElement | null;

    if (!insertFrom || !insertUntil) {
      return;
    }

    // set value of intertUntil as value of insertFrom input
    insertFrom.value = insertUntil.value;
    insertUntil.value = "";
    insertUntil.focus();
  };

  // Causes green borders to appear for today's calendar field
  const injectStyle = () => {
    const css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(
      document.createTextNode(
        "\
.ui-datepicker-calendar td.ui-datepicker-today { \
  background: #62882f;\
}\
.ui-datepicker-calendar td.ui-datepicker-today a:not(.ui-btn-active) {\
  padding: .4em .5em;\
  margin: auto;\
}"
      )
    );
    document.getElementsByTagName("head")[0].appendChild(css);
  };

  const onStdTagChanged = (mutations: MutationRecord[]) => {
    if (mutations[0].attributeName === "value") {
      onSelectedDayChanged();
    }
  };

  const onSelectedDayChanged = () => {
    const dateParts = stdDay?.value?.split(".");
    if (!dateParts || dateParts.length < 2) {
      return;
    }
    const selectedDate = new Date(
      Date.UTC(
        Number.parseInt(dateParts[2]),
        Number.parseInt(dateParts[1]) - 1,
        Number.parseInt(dateParts[0]),
        0,
        0,
        0,
        0
      )
    );
    const nowDate = new Date();
    const todayDate = new Date(
      Date.UTC(
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        0,
        0,
        0,
        0
      )
    );

    const selected = selectedDate.getTime();
    const today = todayDate.getTime();

    const selectedDoW = (selectedDate.getDay() + 6) % 7;
    const todayDoW = (todayDate.getDay() + 6) % 7;
    // Days of week are shifted from Su-Sa to Mo-Su
    // to accomodate for German first day of week.
    // This makes it easier to determine if two
    // dates are in the same week.

    const diff = selected - today;

    stdDayBtn;
    stdDayBtn.classList.remove("ui-btn-f", "ui-btn-g", "ui-btn-b");
    if (selected === today) {
      stdDayBtn.classList.add("ui-btn-g");
    } else if (selected < today) {
      stdDayBtn.classList.add("ui-btn-f");
    } else {
      stdDayBtn.classList.add("ui-btn-b");
    }

    let inWords = "";
    if (diff < -oneDay && diff >= -7 * oneDay) {
      if (selectedDoW < todayDoW) {
        inWords = `${fullDaysOfWeek[selectedDoW]} (`;
      } else {
        inWords = `lz. ${fullDaysOfWeek[selectedDoW]} (`;
      }
    } else if (diff > oneDay && diff <= 7 * oneDay) {
      if (selectedDoW > todayDoW) {
        inWords = `${fullDaysOfWeek[selectedDoW]} (`;
      } else {
        inWords = `nä. ${fullDaysOfWeek[selectedDoW]} (`;
      }
    } else {
      switch (diff) {
        case -oneDay:
          inWords = "Gestern";
          break;
        case 0:
          inWords = "Heute";
          break;
        case oneDay:
          inWords = "Morgen";
          break;
      }
      if (inWords !== "") {
        inWords += `, ${shortDaysOfWeek[selectedDoW]} (`;
      }
    }

    if (inWords === "") {
      stdDayBtn.textContent = `${shortDaysOfWeek[selectedDoW]}., ${stdDay.value}`;
    } else {
      const dateStr = selectedDate.getDate().toString().padStart(2, "0");
      const monthStr = (selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      stdDayBtn.textContent = `${inWords}${dateStr}.${monthStr}.)`;
    }
  };

  // VARIABLES
  let stdDay: HTMLInputElement;
  let stdDayBtn: Element;
  let stdDayObserver: MutationObserver;

  const dayEl = document.getElementById("std-tag") as HTMLInputElement | null;

  if (dayEl != null) {
    stdDay = dayEl;
    stdDayObserver = new MutationObserver(onStdTagChanged);
    stdDayObserver.observe(stdDay, { attributes: true });
  }

  const dayElBtn = document.getElementById("std-tag-btn");
  if (dayElBtn != null) {
    stdDayBtn = dayElBtn;
  }
  // input[type="hidden"] doesn't fire "change" or "input" event;
  // use MutationObserver to detect value change

  onSelectedDayChanged();
  injectStyle();

  // "save" navigates to the same page with different query params => call on init
  updateStartDate();

  // call highlight functions in order of precendence, starting with the lowest
  highlightTodoComments();
  calculateDailyWorkingHours();
};
