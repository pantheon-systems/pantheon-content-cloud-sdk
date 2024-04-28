import { Button } from "@pantheon-systems/pds-toolkit-react";
import React, { useCallback } from "react";

interface Props {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination = ({
  pageSize,
  currentPage,
  totalCount,
  onChange,
  disabled,
}: Props) => {
  const pageCount = Math.ceil(totalCount / pageSize);

  const showPrevButton = currentPage > 0;
  const showNextButton = currentPage + 1 < pageCount;

  const goToNextPage = useCallback(async () => {
    const newPage = Math.min(currentPage + 1, pageCount - 1);
    onChange(newPage);
  }, [currentPage]);

  const goToPreviousPage = useCallback(() => {
    const newPage = Math.max(currentPage - 1, 0);
    onChange(newPage);
  }, [currentPage]);

  return (
    <div className="my-5 flex items-center">
      {showPrevButton && (
        <Button
          style={{ border: "none" }}
          variant="brand-secondary"
          label="Previous"
          onClick={goToPreviousPage}
          displayType="icon-start"
          iconName="arrowLeft"
          disabled={disabled}
        />
      )}
      <div className="px-2">{`${currentPage + 1} of ${pageCount}`}</div>
      {showNextButton && (
        <Button
          style={{ border: "none" }}
          variant="brand-secondary"
          label="Next"
          onClick={goToNextPage}
          displayType="icon-end"
          iconName="arrowRight"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default Pagination;
