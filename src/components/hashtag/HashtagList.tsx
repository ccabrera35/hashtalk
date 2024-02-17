import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";
import HashtagItem from "./HashtagItem";

export default function HashtagList() {
  const companyList = useFeedbackItemsStore((state) => state.getCompanyList());
  const selectCompany = useFeedbackItemsStore((state) => state.selectCompany);
  const selectedCompany = useFeedbackItemsStore(
    (state) => state.selectedCompany
  );

  return (
    <ul className="hashtags">
      {companyList.map((company) => (
        <HashtagItem
          className={
            selectedCompany === company ? "selected-hashtag" : undefined
          }
          company={company}
          onClick={() => {
            if (selectedCompany === company) {
              selectCompany("");
            } else {
              selectCompany(company);
            }
          }}
          key={company}
        />
      ))}
    </ul>
  );
}
