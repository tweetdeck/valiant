export function createInterval(compareValues) {
  function Interval(from, to) {
    if (!from || !to) {
      throw new Error('Interval: missing from/to endpoint(s)');
    }
    this.from = from;
    this.to = to;
    this.empty = this.isEmpty();

    // Normalise values to ensure empty is consistent
    // (prevents incorrectness when comparing bounds. E.g. isSubsetOf)
    if (this.empty) {
      this.from = Interval.posInf;
      this.to = Interval.negInf;
    }
  }

  /**
   * Interval comparison
   */

  Interval.compareValues = compareValues || function (a, b) {
    return (a > b) - (a < b);
  };

  Interval.compareEndpoints = function (a, b) {
    if (a === b) {
      return 0;
    }

    if (a === Interval.negInf || b === Interval.posInf) {
      return -1;
    }
    if (b === Interval.negInf || a === Interval.posInf) {
      return 1;
    }

    return Interval.compareValues(a.value, b.value);
  };

  /**
   * Utilities for creating endpoints
   */
  Interval.inclusiveEndpoint = Interval.incEnd = function (value) {
    return {
      value,
      finite: true,
      inclusive: true
    };
  };
  Interval.exclusiveEndpoint = Interval.excEnd = function (value) {
    return {
      value,
      finite: true,
      inclusive: false
    };
  };
  Interval.adjacentEndpoint = function (endpoint) {
    if (!endpoint.finite) {
      // Infinite is infinite is infinite
      return endpoint;
    }
    // Flip inclusivity bit to make adjacent endpoint
    return (
      endpoint.inclusive ?
        Interval.exclusiveEndpoint(endpoint.value) :
        Interval.inclusiveEndpoint(endpoint.value)
    );
  };

  Interval.negativeInfinity = Interval.negInf = {
    value: -Infinity,
    finite: false,
    inclusive: false
  };
  Interval.positiveInfinity = Interval.posInf = {
    value: Infinity,
    finite: false,
    inclusive: false
  };

  /**
   * Public API
   */

  Interval.prototype.equalTo = function (other) {
    if (this.empty && other.empty) {
      return true;
    }
    if (this.empty !== other.empty) {
      return false;
    }
    return (
      this.fromComparator(this.from, other.from) === 0 &&
      this.toComparator(this.to, other.to) === 0
    );
  };

  Interval.prototype.intersection = function (other) {
    if (this.empty || other.empty) {
      return Interval.empty;
    }

    const highestFrom = (
      this.fromComparator(this.from, other.from) > 0 ?
        this.from :
        other.from
    );
    const lowestTo = (
      this.toComparator(this.to, other.to) > 0 ?
        other.to :
        this.to
    );

    return new Interval(highestFrom, lowestTo);
  };

  Interval.prototype.complement = function () {
    return {
      before: new Interval(
        Interval.negInf,
        Interval.adjacentEndpoint(this.from)
      ),
      after: new Interval(
        Interval.adjacentEndpoint(this.to),
        Interval.posInf
      )
    };
  };

  Interval.prototype.contiguousWith = function (other) {
    if (this.empty || other.empty) {
      return true;
    }

    // E.g. [a,c] U [b,d] = [a,d]
    let isContiguous = !this.intersection(other).empty;

    if (!isContiguous) {
      // Does an open end-point of one interval match a closed end-point of the other
      // E.g. // [a,b) U [b,c] = [a,c]
      const canConcatThisAndOther = (
        Interval.compareEndpoints(this.to, other.from) === 0 &&
        (this.to.inclusive || other.from.inclusive)
      );
      const canConcatOtherAndThis = (
        Interval.compareEndpoints(other.to, this.from) === 0 &&
        (other.to.inclusive || this.from.inclusive)
      );
      isContiguous = canConcatThisAndOther || canConcatOtherAndThis;
    }

    return isContiguous;
  };

  Interval.prototype.unify = function (other) {
    if (!this.contiguousWith(other)) {
      return Interval.empty;
    }

    return this.hull(other);
  };

  Interval.prototype.hull = function (other) {
    if (this.empty) {
      return other;
    }

    if (other.empty) {
      return this;
    }

    const lowestFrom = (
      this.fromComparator(this.from, other.from) < 0 ?
        this.from :
        other.from
    );
    const highestTo = (
      this.toComparator(this.to, other.to) < 0 ?
        other.to :
        this.to
    );

    return new Interval(lowestFrom, highestTo);
  };

  Interval.prototype.contains = function (value) {
    if (this.empty) {
      return false;
    }
    return !this.intersection(Interval.singleton(value)).empty;
  };

  Interval.prototype.isSubsetOf = function (other) {
    return (
      this.fromComparator(this.from, other.from) >= 0 &&
      this.toComparator(this.to, other.to) <= 0
    );
  };

  /**
   * Private
   */

  Interval.prototype.fromComparator = function (a, b) {
    let ordering = Interval.compareEndpoints(a, b);
    if (ordering === 0) {
      // Inclusive should sort before exclusive
      ordering = b.inclusive - a.inclusive;
    }
    return ordering;
  };

  Interval.prototype.toComparator = function (a, b) {
    let ordering = Interval.compareEndpoints(a, b);
    if (ordering === 0) {
      // Exclusive should sort before inclusive
      ordering = a.inclusive - b.inclusive;
    }
    return ordering;
  };

  Interval.prototype.toString = function () {
    if (this.empty) {
      return '{}';
    }

    return [
      this.from.inclusive ? '[' : '(',
      this.from.value,
      ',',
      this.to.value,
      this.to.inclusive ? ']' : ')',
      this.empty ? ' (empty)' : ''
    ].join('');
  };

  Interval.prototype.isEmpty = function () {
    // where a < b,
    // empty is defined as [b,a] or (a,a) or [a,a) or (a,a]
    const bothInclusive = this.from.inclusive && this.to.inclusive;
    const ordering = Interval.compareEndpoints(this.from, this.to);
    return (
      // [b,a]
      ordering > 0 ||
      // (a,a) or [a,a) or (a,a]
      (ordering === 0 && !bothInclusive)
    );
  };

    /**
     * Utils
     */

  Interval.singleton = function (value) {
    return new Interval(
      Interval.incEnd(value),
      Interval.incEnd(value)
    );
  };

  Interval.empty = new Interval(
    Interval.posInf,
    Interval.negInf
  );

  Interval.whole = new Interval(
    Interval.negInf,
    Interval.posInf
  );

  return Interval;
}
