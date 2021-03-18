/** @jsx h */
import { h, FunctionComponent } from "preact";
import { BookingFormPage } from "../../../Typings/BookingFormPage";
import { Button } from "../../Common/Button";
import { Form, FormProps } from "../../Common/Form";
import {
  QuantitySelection,
  QuantitySelectionProps,
} from "../../Common/QuantitySelection";
import { TextStyle } from "../../Common/TextStyle";
import { useWizardModalAction } from "../../Common/WizardModal";
import "./OrderDetails.scss";

export type OrderDetailsProps = {
  /**Date of event. */
  dateOfEvent: string;
  /**Start time of event. */
  startTimeEvent: string;
  /**End time of event. */
  endTimeEvent: string;
  /**Remaining spots in event. */
  remainingSpots: number;
  /**Cost of event. */
  cost: number;
  /**Quantity associated with cost (e.g. "/ person") */
  costQuantity: string;
  /**Whether component is undergoing storybook testing.  */
  isStorybookTest?: boolean;
  /**Callback  */
  onBackClick: () => void;
  /**Quantity selection information for variant in experience.*/
  quantitySelections: QuantitySelectionProps;
  /**Default customer form fields. */
  customerFormFields: FormProps;
};

export const OrderDetails: FunctionComponent<OrderDetailsProps> = ({
  dateOfEvent,
  startTimeEvent,
  endTimeEvent,
  remainingSpots,
  isStorybookTest,
  cost,
  costQuantity,
  quantitySelections,
  customerFormFields,
}) => {
  //Define set page function, with stub if testing.
  let setPage = isStorybookTest
    ? (temp: number) => {}
    : useWizardModalAction().setPage;

  return (
    <div className="OrderDetails">
      <div className="OrderDetails__Summary">
        <TextStyle variant="display2" text={dateOfEvent} />
        <div>
          <TextStyle
            variant="body1"
            text={`${startTimeEvent} - ${endTimeEvent}`}
          />
          <TextStyle variant="body1" text="|" />
          <TextStyle
            variant="body3"
            text={
              remainingSpots > 1
                ? `${remainingSpots} spots left`
                : `${remainingSpots} spot left`
            }
          />
        </div>
        <div>
          <TextStyle variant="body2" text={`From $${cost}`} />
          <TextStyle variant="body1" text={costQuantity} />
        </div>
      </div>

      <div className="OrderDetails__Input">
        <QuantitySelection {...quantitySelections} />
        <div className="OrderDetails__Input__Customer-Form">
          <Form {...customerFormFields} />
        </div>
      </div>
      {/* <Button
        variant="contained"
        color="primary"
        text="Save and Continue"
        onClick={() => {
          setPage(BookingFormPage.SUBMISSION_LOADER);
        }}
      /> */}
    </div>
  );
};
