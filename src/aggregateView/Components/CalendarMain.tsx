import "./CalendarMain.scss";
import { addDays } from "date-fns/fp";
import { format } from "date-fns";
import { Component, createRef, h } from "preact";
import { CalendarViewSelector } from "../../SharedComponents/Calendar/CalendarViewSelector";
import { fetchProductsWithAvailability } from "../../Utils/api";
import {
  Calendar,
  CalendarEvent,
  calendarViewType,
  FullCalendarEvent,
} from "../../SharedComponents/Calendar/CalendarWrapper";
import { extractAndParseEvents } from "../../Utils/helpers";
import { CalendarEventListContent } from "../../SharedComponents/Calendar/CalendarEventListContent";
import { CalendarEventGridContent } from "../../SharedComponents/Calendar/CalendarEventGridContent";
import { CalendarDaySchedule } from "../../SharedComponents/Calendar/CalendarDaySchedule";
import { CalendarEventClick, DateClickEvent } from "../../typings/Calendar";
import { CalendarNoEventsMessage } from "../../SharedComponents/Calendar/CalendarNoEventsMessage";

interface ICalendarContainerProps {
  aggregateViewBaseUrl?: string;
  aggregateViewShop?: string;
  aggregateViewShopUrl?: string;
  defaultVew?: string;
  baseUrl?: string;
  languageCode?: string;
  shopUrl?: string;
  storefrontAccessToken?: string;
}

interface ICalendarContainerState {
  view: string;
  daySelected?: Date;
  events: CalendarEvent[];
  fullCalendarEvents: FullCalendarEvent[];
  daySelectedEvents: CalendarEvent[];
}

const eventRendererViewMap = {
  [calendarViewType.dayGrid]: CalendarEventGridContent,
  [calendarViewType.list]: CalendarEventListContent,
};

export class CalendarContainer extends Component<ICalendarContainerProps, ICalendarContainerState> {
  calendarRef = createRef();
  state: ICalendarContainerState = {
    view: calendarViewType.dayGrid,
    events: [],
    fullCalendarEvents: [],
    daySelected: null,
    daySelectedEvents: [],
  };

  async componentDidMount() {
    const { baseUrl, shopUrl, defaultVew } = this.props;
    const eventsResponse = await fetchProductsWithAvailability(baseUrl, shopUrl, new Date(), addDays(30)(new Date()));
    const { calendarEvents: events, fullCalendarEvents } = extractAndParseEvents(eventsResponse, shopUrl);
    this.setState({ events, fullCalendarEvents });

    // only show list view on smaller screens
    if (window && window.innerWidth < 768) {
      this.selectView(calendarViewType.list);
    }

    if (defaultVew && calendarViewType[defaultVew]) {
      this.selectView(calendarViewType[defaultVew])
    }
  }

  navigateToNextAvailableTS = () => {
    const earliestAvailableEventDate = Math.min(...this.state.events.map(e => e.start.getTime()));
    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.gotoDate(new Date(earliestAvailableEventDate));
  };

  renderCalendarNoEventsMessage = () => {
    return <CalendarNoEventsMessage  onNextAvailableClick={this.navigateToNextAvailableTS} />;
  };

  handleEventClick = ({ event: { _def, _instance }}: CalendarEventClick) => {
    const eventSelected = this.state.events.find(e => _def.publicId.includes(e.id));
    this.setState({ daySelected: _instance.range.start, daySelectedEvents: [eventSelected] });
  };

  selectView = (view: string) => {
    const calendarApi = this.calendarRef.current.getApi();
    calendarApi.changeView(view);
    this.setState({ view });
  };

  handleMoreClick = ({ date }: DateClickEvent) => {
    const earliest = new Date(date).getTime();
    const latest = new Date(date).setHours(23, 59, 59);
    const daySelectedEvents = this.state.events.filter(e => e.start.getTime() >= earliest && e.end.getTime() < latest);
    this.setState({ daySelected: date, daySelectedEvents });
  };

  handleClose = () => this.setState({ daySelected: null });

  render() {
    const { fullCalendarEvents, view, daySelected, daySelectedEvents } = this.state;
    const titleFormat = window && window.innerWidth >= 1024 ? null : { month: "short", year: "numeric" };

    return (
      <div className="CalendarAggregate-Container">
        <div className="main-heading">Events Calendar</div>
        <div className="AggregateCalendar-Main">
          <CalendarViewSelector view={view} selectView={this.selectView} />
          <CalendarDaySchedule
            open={!!daySelected && !!daySelectedEvents.length}
            handleClose={this.handleClose}
            title={daySelected ? format(daySelected, "MMMM d, y") : ""}
            events={daySelectedEvents}
          />
          <Calendar
            dayMaxEventRows={4}
            eventClick={this.handleEventClick}
            forwardRef={this.calendarRef}
            view={view}
            events={fullCalendarEvents}
            eventContent={eventRendererViewMap[view]}
            titleFormat={titleFormat}
            moreLinkClick={this.handleMoreClick}
            noEventsContent={this.renderCalendarNoEventsMessage()}
          />
        </div>
      </div>
    );
  }
}