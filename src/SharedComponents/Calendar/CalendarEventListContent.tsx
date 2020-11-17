import { h, JSX } from "preact";
import "./CalendarEventListContent.scss";
import { ICalendarEventContent } from "../../typings/Calendar";

export const CalendarEventListContent = ({ event: { _def } }: ICalendarEventContent): JSX.Element => {
  const { extendedProps: e } = _def;

  return (
    <div className="calendar-event-list-details">
      <div className="featured-image">
        <img src={e.imageUrl as string} alt="Event featured image" />
      </div>
      <div className="event-description">
        <div>{_def.title}</div>
        <div>
          <span>{e.paymentType}</span>
          {e.price[1] > 0 && <span>{" | "}</span>}
          {e.price[1] > 0 && <span>{e.price[0]}</span>}
        </div>
      </div>
    </div>
  );
};