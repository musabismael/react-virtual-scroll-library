import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class VirtualScroll extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startItemIndex: 0,
    };
    this.containerRef = React.createRef();
  }

  handleScroll = () => {
    const container = this.containerRef.current;
    if (!container) return;

    const { itemHeight, itemCount, onLoadMore } = this.props;
    const totalHeight = itemHeight * itemCount;
    const { scrollTop, clientHeight } = container;

    if (scrollTop + clientHeight >= totalHeight * 0.8) {
      onLoadMore();
    }

    const startItemIndex = Math.floor(scrollTop / itemHeight);
    this.setState({ startItemIndex });
  };

  componentDidMount() {
    this.containerRef.current.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.containerRef.current.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { data, renderItem, itemHeight, loadingIndicator, onItemClick } = this.props;
    const { startItemIndex } = this.state;

    const visibleItems = data.slice(
      startItemIndex,
      startItemIndex + Math.ceil(this.containerRef.current.clientHeight / itemHeight)
    );

    return (
      <div ref={this.containerRef} style={{ overflowY: 'auto', height: '400px' }}>
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
  }
}

VirtualScroll.propTypes = {
  data: PropTypes.array.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired,
  loadingIndicator: PropTypes.func,
  onItemClick: PropTypes.func,
  onLoadMore: PropTypes.func,
};

// Test application


