import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const VirtualScroll = ({
  data,
  itemHeight,
  itemCount,
  renderItem,
  loadingIndicator,
  onItemClick,
  onLoadMore,
}) => {
  const [startItemIndex, setStartItemIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const totalHeight = itemHeight * itemCount;
    const { scrollTop, clientHeight } = container;

    if (scrollTop + clientHeight >= totalHeight * 0.8) {
      onLoadMore();
    }

    const newStartItemIndex = Math.floor(scrollTop / itemHeight);
    setStartItemIndex(newStartItemIndex);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const visibleItems = data.slice(
    startItemIndex,
    startItemIndex + Math.ceil((containerRef.current?.clientHeight || 0) / itemHeight)
  );

  return (
    <div ref={containerRef} style={{ overflowY: 'auto', height: '400px' }}>
      <div style={{ height: `${data.length * itemHeight}px` }}>
        {visibleItems.map((item, index) => (
          <div
            key={index}
            style={{ height: `${itemHeight}px` }}
            onClick={() => onItemClick && onItemClick(item)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
      {loadingIndicator && loadingIndicator()}
    </div>
  );
};

VirtualScroll.propTypes = {
  data: PropTypes.array.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  loadingIndicator: PropTypes.func,
  onItemClick: PropTypes.func,
  onLoadMore: PropTypes.func,
};

export default VirtualScroll;
