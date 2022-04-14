/**
 * TargetBay Customizations
 *
 * Customizes TargetBay BayReviews modules
 */
(function() {
  var acTargetBay = (function() {
    var CLASS_REVIEWS_COUNT = 'targetbay-reviews-count-field',
        ID_SITE_REVIEWS     = 'targetbay_site_reviews', // the floating "reviews" tab
        ID_PRODUCT_REVIEWS  = 'targetbay_reviews', // the main reviews section
        $body;

    function init() {
      if (window.location.pathname !== '/products/protein') {
        cacheDom();
        bindEvents();
        handleSiteReviewsModuleLoad();
      } else {
        cacheDom();
        bindEvents();
        handleProductReviewsCountModuleLoad();
        handleProductReviewsModuleLoad();
        handleSiteReviewsModuleLoad();
      }
    }

    function cacheDom() {
      $body = $('body');
    }

    function bindEvents() {
      $body.on('click', '#' + ID_SITE_REVIEWS, handleClickSiteReviews);
    }

    function handleClickSiteReviews(e) {
      // switch to ProductReviews tab
      tbsForm.tbTabClick('tbProductReviews');
    }

    function handleProductReviewsCountModuleLoad() {
      var targetNode = document.querySelector('.header__custom');
      if (!targetNode) { return; }
      var config = { attributes: false, childList: true, subtree: true };

      var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList') {
            if (mutation.addedNodes.length) {
              for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].classList.contains(CLASS_REVIEWS_COUNT)) {
                  $('.' + CLASS_REVIEWS_COUNT).appendTo('#tb-reviews-count-field-wrapper').css('display', 'block');
                  observer.disconnect();
                  break;
                }
              }
            }
            break;
          }
        }
      }

      var observer = new MutationObserver(callback);

      observer.observe(targetNode, config);
    }

    function handleProductReviewsModuleLoad() {
      var targetNode = document.getElementById('shopify-section-footer');
      if (!targetNode) { return; }
      var config = { attributes: false, childList: true, subtree: false };

      var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList') {
            if (mutation.addedNodes.length) {
              for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].id = ID_PRODUCT_REVIEWS) {
                  $('#' + ID_PRODUCT_REVIEWS).appendTo('#tb-product-reviews-wrapper').css('display', 'block');
                  handleProductReviewIds();
                  observer.disconnect();
                  break;
                }
              }
            }
            break;
          }
        }
      }

      var observer = new MutationObserver(callback);

      observer.observe(targetNode, config);
    }

    function handleProductReviewIds() {
      var targetNode = document.getElementById(ID_PRODUCT_REVIEWS);
      if (!targetNode) { return; }
      var config = { attributes: false, childList: true, subtree: true };

      var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList') {
            // collect the list of reviews
            var divProductReviews = null;

            if (mutation.addedNodes.length) {
              for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].id === 'tbProductReviews' && mutation.addedNodes[i].tagName === 'DIV') {
                  divProductReviews = mutation.addedNodes[i];

                  // update the IDs of the reviews
                  var reviews = divProductReviews.querySelectorAll('.tb-review-main-cont');
                  var args = {
                    reviews   : reviews,
                    elName    : '.tbSiteReviews-tbClientName span',
                    elTitle   : '.tbSiteReviews-tbClientTitle',
                    baseClass : 'tb-review-main-cont--'
                  };
                  addUniqueProductIds(args.reviews, args.elName, args.elTitle, args.baseClass);
                  break;
                }
              }
            }
          }
        }
      }

      var observer = new MutationObserver(callback);

      observer.observe(targetNode, config);
    }

    /**
     * Observes body for Site Reviews module
     */
    function handleSiteReviewsModuleLoad() {
      var targetNode = document.getElementsByTagName('body')[0];
      var config = { attributes: false, childList: true, subtree: false }

      var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList') {
            if (mutation.addedNodes.length) {
              for (var node of mutation.addedNodes) {
                if (node.id === ID_SITE_REVIEWS && node.tagName === 'DIV') {
                  handleSiteReviewsLoad();
                  observer.disconnect();
                  break;
                }
              }
              return;
            }
          }
        }
      }

      var observer = new MutationObserver(callback);

      observer.observe(targetNode, config);
    }

    /**
     * Observes Site Reviews module. Adds Product Review IDs.
     */
    function handleSiteReviewsLoad() {
      var targetNode = document.getElementById(ID_SITE_REVIEWS);
      if (!targetNode) { return; }
      var config = { attributes: false, childList: true, subtree: false }

      var callback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList') {
            if (mutation.addedNodes.length) {
              for (var node of mutation.addedNodes) {
                if (node.id === 'tbSiteReviews' && node.tagName === 'DIV') {
                  var reviews = node.querySelectorAll('#targetbay-product-reviews .tbSiteReviews-reviewContainerEach');
                  var args = {
                    reviews: reviews,
                    nameEl: '.tbSiteReviews-UserName',
                    titleEl: '.tbSiteReviews-tbClientTitle',
                    baseClass: 'tbSiteReviews-reviewContainerEach--'
                  };
                  addUniqueProductIds(args.reviews, args.nameEl, args.titleEl, args.baseClass);
                  break;
                }
              }
            }
          }
        }
      }

      var observer = new MutationObserver(callback);

      observer.observe(targetNode, config);
    }

    /**
     * Add Unique IDs to Product Reviews
     *
     * @param {NodeList} reviews the product review elements
     * @param {String} nameEl the selector for the reviewer's name
     * @param {String} titleEl the selector for the review's title
     * @param {String} baseClass the base class to append the UID to
     */
    function addUniqueProductIds(reviews, nameEl, titleEl, baseClass) {
      for (review of reviews) {
        var name  = review.querySelector(nameEl);
        var title = review.querySelector(titleEl);
        name      = (name) ? (name.innerText || name.textContent) : 'name';
        title     = (title) ? (title.innerText || title.textContent) : 'title';
        var id    = sanitizeId(name) + '-' + sanitizeId(title);
        review.id = id;
        review.classList.add(baseClass + id);
      }
    }

    function sanitizeId(id) {
      var idNew;
      idNew = id.trim();
      idNew = idNew.replace(/ /g, '-');
      idNew = idNew.replace(/_/g, '-');
      idNew = idNew.replace(/--/g, '-');
      idNew = idNew.replace(/[^-A-Za-z0-9]/g, '');
      idNew = idNew.toLowerCase();
      return idNew;
    }

    return {
      init: init
    };
  })();

  acTargetBay.init();
})();
