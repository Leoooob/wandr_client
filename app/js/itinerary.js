'use strict';

var used_venues = [];
var venue_information = {};
const venues = JSON.parse(localStorage.getItem('venue_data'));
const itinerary_container = document.getElementById('itinerary_container');

function next_venue(current_venue, current_position) {
  //if exists in used_venues
  if (used_venues.indexOf(current_position) !== -1) {
    current_position++;
    
    if (current_position > (venues.venues.length - 1)) {
      current_position = 0;
    }
    
    return next_venue(current_venue, current_position);
  } else {
    let remove_me = used_venues.indexOf(current_venue);
    used_venues.splice(remove_me, 1);
    used_venues.push(current_position);
    
    let id = venues.venues[current_position].id;
    let name = venues.venues[current_position].name;
    
    return [id, name, current_position]
  }
}

function previous_venue(current_venue, current_position) {
  if (used_venues.indexOf(current_position) !== -1) {
    current_position--;
    
    if (current_position < 0) {
      let final_element = (venues.venues.length - 1);
      current_position = final_element;
    }
    
    return previous_venue(current_venue, current_position);
  } else {
    let remove_me = used_venues.indexOf(current_venue);
    used_venues.splice(remove_me, 1);
    used_venues.push(current_position);
    
    let id = venues.venues[current_position].id;
    let name = venues.venues[current_position].name;
    
    return [id, name, current_position]
  }
}

function update_itinerary_name() {
  let location = '';
  if (localStorage.getItem('itinerary_name') === null) {
    location = localStorage.getItem('location');
  } else {
    location = localStorage.getItem('itinerary_name');
  }
  
  $('span.summary_location').text(location);
  build_itinerary();
}

function build_no_results() {
  let new_element = document.createElement('div');
  {
    new_element.tabIndex = '1';
    new_element.className = 'no_results';
    {
      let para = document.createElement('p');
      {
        para.appendChild(document.createTextNode("Sorry, we couldn't find anything for you to do here."));
      }
      new_element.appendChild(para);
      var para_2 = document.createElement('p');
      let a = document.createElement('a');
      {
        a.href = 'index.html';
        a.appendChild(document.createTextNode('Try another location?'));
      }
      para_2.appendChild(a);
    }
    new_element.appendChild(para_2);
  }
  return new_element;
}

function build_itinerary() {
  if (venues.venues.length === 0) {
    let new_element = build_no_results();
    itinerary_container.appendChild(new_element);
    return;
  } else {
    let itinerary_items = venues.venues.slice(0, 5);
    itinerary_items.forEach(function(element, index) {
      //start component builder
      build_item_pill(index);
      //add each venue index to the list
      used_venues.push(index);
    });
    
    //contains all event listeners for item pills
    add_event_listeners();
    //create a function for each event listener and add them after creating the element?
  }
}

function build_article(venue_index) {
  let article = document.createElement('article');
  {
    article.tabIndex = '0';
    article.className = 'slot';
    article.dataset.pinned = 'false';
    {
      let a1 = document.createElement('a');
      {
        a1.href = '#';
        a1.className = 'slot__left-arrow';
        {
          let img = document.createElement('img');
          img.src = './assets/arrow-left.svg';
          a1.appendChild(img);
        }
        article.appendChild(a1)
      }

      let a2 = document.createElement('a');
      {
        a2.href = '#';
        a2.className = 'slot__genre-button';
        {
          let img = document.createElement('img');
          img.src = './assets/genre_32.svg';
          a2.appendChild(img);
        }
        article.appendChild(a2)
      }

      let div = document.createElement('div');
      {
        div.className = 'slot__title';
        div.appendChild(document.createTextNode(venues.venues[venue_index].name));
      }
      article.appendChild(div);

      let a3 = document.createElement('a');
      {
        a3.href = '#';
        a3.className = 'slot__right-arrow';
        {
          let img = document.createElement('img');
          img.src = './assets/arrow-right.svg';
          a3.appendChild(img);
        }
        article.appendChild(a3)
      }

      let a4 = document.createElement('a');
      {
        a4.href = '#';
        a4.className = 'slot__pin-button';
        {
          let img = document.createElement('img');
          img.src = './assets/pin-unfilled.svg';
          a4.appendChild(img);
        }
        article.appendChild(a4)
      }
    }
  }
  return article;
}

function build_travel() {
  let travel = document.createElement('div');
  {
    travel.className = 'travel';
    let travel_select = document.createElement('select');
    {
      travel_select.className = 'travel__mode';
      let modes = ['Walking', 'Cycling', 'Driving', 'Public Transport'];
      
      modes.forEach(function(element) {
        let option = document.createElement('option');
        option.text = element;
        travel_select.add(option);
      });
    }
    travel.appendChild(travel_select);

    let travel_node = document.createElement('img');
    {
      travel_node.className = 'travel__node';
      travel_node.src = './assets/travel-node_32.svg'
    }
    travel.appendChild(travel_node);

    let travel_time = document.createElement('div');
    {
      travel_time.className = 'travel__time';
      travel_time.appendChild(document.createTextNode('unknown'));
    }
    travel.appendChild(travel_time);
  }
  return travel;
}

function build_travel_instructions() {
  let travel_instructions = document.createElement('ul');
  {
    travel_instructions.className = 'travel__instructions';
    let instruction = document.createElement('li');
    {
      instruction.appendChild(document.createTextNode('no instructions set, yet'));
    }
    travel_instructions.appendChild(instruction);
  }
  return travel_instructions;
}

function build_item_pill(venue_index) {
  let new_item = document.createElement('div');
  {
    new_item.className = 'slot_box';
    new_item.dataset.travel = 'false';
    new_item.dataset.venueid = venues.venues[venue_index].id;
    new_item.dataset.index = venue_index;
    {
      let article = build_article(venue_index);
      new_item.appendChild(article);
      
      let travel = build_travel();
      new_item.appendChild(travel);
      
      let travel_instructions = build_travel_instructions();
      new_item.appendChild(travel_instructions);
    }
  }
  itinerary_container.appendChild(new_item);
}

function edit_itinerary_name() {
  let span = $('span.summary_location');
  let input = $('.trip_name_input');
  
  if(span.css('display') == 'none') {
    let new_name = input.val();
    //if val empty and localstorage exists just set text
    if (new_name.length === 0) {
      new_name = localStorage.getItem('location');
    }
    localStorage.setItem('itinerary_name', new_name);
    span.text(new_name);
    
    input.hide();
    span.show();
  } else {
    span.hide();
    input.show();
  }
}

function add_event_listeners() {
  $('.slot__right-arrow').on('click', function(event) {
    if (event) event.preventDefault();
    
    let origin = $(this);
    let slot = origin.closest('.slot_box');
    let slot_label = origin.siblings('.slot__title');
    let current_index = parseInt(slot.attr('data-index'));
    
    //0 = id, 1 = name, 2 = index of new venue in venues array
    let data = next_venue(current_index, current_index);
    const venue_id = data[0];
    const venue_name = data[1];
    const new_index = data[2];
    
    slot.attr('data-index', new_index);
    slot.attr('data-venueid', venue_id);
    slot_label.text(venue_name);
  });
  
  $('.slot__left-arrow').on('click', function(event) {
    if (event) event.preventDefault();
    
    let origin = $(this);
    let slot = origin.closest('.slot_box');
    let slot_label = origin.siblings('.slot__title');
    let current_index = parseInt(slot.attr('data-index'));
    
    //0 = id, 1 = name, 2 = index of new venue in venues array
    let data = previous_venue(current_index, current_index);
    const venue_id = data[0];
    const venue_name = data[1];
    const new_index = data[2];
    
    slot.attr('data-index', new_index);
    slot.attr('data-venueid', venue_id);
    slot_label.text(venue_name);
  });
  
  $('.slot__pin-button').on('click', function(event) {
    if (event) event.preventDefault();

    let origin_div = $(this);
    let parent_div = origin_div.closest('.slot');
    let pin_state = parent_div.data('pinned');

    let pin_src = pin_state ? "./assets/pin-unfilled.svg" :  "./assets/pin-filled.svg";
    origin_div.find('img').attr('src', pin_src);
    parent_div.data('pinned', !pin_state);
    //count the number of pinned items, if this is number of itinerary items display travel stuff
  });
  
  $('.travel__node').on('click', function() {
    let origin_div = $(this);
    let parent_div = origin_div.closest('.slot_box');

    if (parent_div.data('travel') == 'true') {
      parent_div.find('.travel__node').removeClass('travel__node__active');
      parent_div.find('.travel__instructions').hide();
      parent_div.data('travel', 'false');
    } else {
      parent_div.find('.travel__node').addClass('travel__node__active');
      parent_div.find('.travel__instructions').show();
      parent_div.data('travel', 'true');
    }
  });
  
  $('.slot__title').on('click', function() {
    let modal = $('#venue_info');
    if (modal.css('display') == 'none') {
      //only call this if we are displaying the modal
      let origin_div = $(this);
      let parent_div = origin_div.closest('.slot_box');
      let venue_id = parent_div.attr('data-venueid');

      venue_info(venue_id);
      //build venue modal, then display
      modal.css('display', 'block');
    }
  });
  
  //closing the modal
  $('.modal-close').on('click', function() {
    $('#venue_info').css('display', 'none');
  });
  
  //needs to use non deprecated methods
  /*window.onclick = function(event) {
    if (event.target == $('#venue_info')) {
      modal.css('display', 'none');
    }
  }*/
}

function venue_info(venue_id) {
  let my_url = 'http://localhost:3000/api/venue';
  
  $.ajax({
    url: my_url,
    type: 'GET',
    data: {
      id: venue_id
    },
    success: function(response) {
      build_venue_JSON(response);
    },
    error: function(error) {
      console.log('Error: ' + error);
    }
  });
}

function build_venue_JSON(response) {
  //general stuff
  venue_information.name = response.name;
  venue_information.url = response.url;
  venue_information.foursquare = response.canonicalUrl;
  
  //categories
  let categories = response.categories;
  venue_information.categories = [];
  
  categories.forEach(function(element) {
    venue_information.categories.push(element.name);
  });
  
  venue_information.address = response.location.formattedAddress; //this is an array, each element is a line of address

  //opening times
  let opening_times = '';
  if (response.hours !== undefined) {
    opening_times = response.hours.timeframes;
  } else if (response.popular !== undefined) {
    opening_times = response.popular.timeframes;
  } else {
    opening_times = 'No opening times were found for this venue'
  }
  
  venue_information.times = [];
  
  if (opening_times != 'No opening times were found for this venue') {
    opening_times.forEach(function (element) {
      let days = element.days;
      if (days == 'Today') {
        return;
      } else {
        let times_list = element.open;
        let times = [];
        times_list.forEach(function (element) {
          times.push(element.renderedTime);
        });

        let day_times = {
          'days': days,
          'times': times
        };

        venue_information.times.push(day_times);
      }
    });
  } else {
    let day_times = {
      'days': 'No opening times were found',
      'times': 'Sorry.'
    };
    venue_information.times.push(day_times);
  }

  //ratings
  venue_information.avg_rating = response.rating;
  venue_information.no_ratings = response.ratingSignals;

  //gylphs
  venue_information.glyphs = [];
  let glyph_stuff = response.attributes.groups;

  console.log(venue_information.name + ': ');
  for (let i = 0; i < glyph_stuff.length; i++) {
    let this_glyph = glyph_stuff[i].items[0];
    //easy to collect more glyph data, just add more usable cases
    switch (this_glyph.displayName) {
      case 'Price':
        venue_information.glyphs.price = this_glyph.displayValue;
        break;

      case 'Credit Cards':
        venue_information.glyphs.creditcard = this_glyph.displayValue;
        break;

      case 'Outdoor Seating':
        venue_information.glyphs.outdoor = this_glyph.displayValue;
        break;

      case 'Wi-Fi':
        venue_information.glyphs.wifi = this_glyph.displayValue;
        break;

      default:
        console.log("Sorry we don't currently display glyph information for " + this_glyph.displayName);
        break;
    }
  }

  //social media
  venue_information.facebook = response.contact.facebookUsername;
  venue_information.twitter = response.contact.twitter;
  //console.log(venue_information);
  build_venue(venue_information);
}

//wrap this function call in a try-catch in case it cannot interpret some data and it ends up displaying stale info
function build_venue(venue_info) {
  //add venue id as data role and check that before rebuilding the modal
  let container = $('#venue_information');
  container.children('h3').text(venue_info.name);
  let url = (venue_info.url !== undefined) ? venue_info.url : 'No website available';
  if (url == 'No website available') {
    container.children('a').attr('href', '#').text(url);
  } else {
    container.children('a').attr('href', url).text(url);
  }
  
  //add link to the foursquare attribution
  $('.foursquare-attribution').attr('href', venue_info.foursquare);
  
  let categories = venue_info.categories
  let category_list = container.children('.venue__categories').children('ul');
  category_list.empty();
  
  categories.forEach(function(element) {
    let category = document.createElement('li');
    {
      category.append(document.createTextNode(element));
    }
    category_list.append(category);
  });
  
  let address_element = $('.venue__address');
  address_element.children('address').empty();
  address_element.children('address').text(venue_info.address.join(',\n')).wrap('<pre />');
  
  let opening_times = $('.venue__times').children('ul');
  opening_times.empty();
  
  venue_info.times.forEach(function(element) {
    let li = document.createElement('li');
    {
      li.append(document.createTextNode(element.days + ': ' + element.times));
    }
    opening_times.append(li);
  });
  
  let rating_div = $('.venue__rating');
  rating_div.empty();
  
  rating_div.append('<strong>Rating</strong>').append(': ' + venue_info.avg_rating + '/10 (rated by ' + venue_info.no_ratings + ' people)');
  
  let glyphs = $('.glyph-icon');
  let text = 'This is the price rating';
  let tooltip_arrow = document.createElement('div');
  tooltip_arrow.className = 'arrow';
  
  //use a for loop?
  if (venue_info.glyphs.price === undefined) {
    venue_info.glyphs.price = '';
  }
  let money = venue_info.glyphs.price.length;
  glyphs.eq(0).children('img').attr('src', './assets/venue_glyph/pound_glyph_' + money + '.svg');
  glyphs.eq(0).children('span').text(text);
  glyphs.eq(0).children('span').append(tooltip_arrow);
  
  let creditcard = (venue_info.glyphs.creditcard == "Yes") ? '_yes' : '';
  text = (creditcard.length > 0) ? 'Accepts creditcard' : 'Does not accept creditcard';
  glyphs.eq(1).children('img').attr('src', './assets/venue_glyph/credit_card_glyph' + creditcard + '.svg');
  glyphs.eq(1).children('span').text(text);
  glyphs.eq(1).children('span').append(tooltip_arrow);
  
  let wifi = (venue_info.glyphs.wifi == 'Free') ? '_yes' : '';
  text = (wifi.length > 0) ? 'Free wi-fi available' : 'No free wi-fi';
  glyphs.eq(2).children('img').attr('src', './assets/venue_glyph/wifi_glyph' + wifi + '.svg');
  glyphs.eq(2).children('span').text(text);
  glyphs.eq(2).children('span').append(tooltip_arrow);
  
  let outdoor = (venue_info.glyphs.outdoor == 'Yes') ? '_yes' : '';
  text = (outdoor.length > 0) ? 'There is outdoor seating available' : 'There is no outdoor seating available';
  glyphs.eq(3).children('img').attr('src', './assets/venue_glyph/outdoor_seating_glyph' + creditcard + '.svg');
  glyphs.eq(3).children('span').text(text);
  glyphs.eq(3).children('span').append(tooltip_arrow);
  
  let social_div = $('.social');
  
  if (venue_info.facebook !== undefined) {
    let facebook_link = 'https://www.facebook.com/' + venue_info.facebook;
    
    let a_tag = social_div.eq(0).children('a');
    a_tag.attr('href', facebook_link);
    let label = a_tag.children('span');
    label.contents().filter(function() {
      return (this.nodeType == 3);
    }).remove();
    label.append('/' + venue_info.facebook);
  } else {
    let a_tag = social_div.eq(0).children('a');
    a_tag.attr('href', '#')
    let label = a_tag.children('span');
    label.contents().filter(function() {
      return (this.nodeType == 3);
    }).remove();
    label.append(document.createTextNode(' N/A'));
  }
  
  if (venue_info.twitter !== undefined) {
    let twitter_link = 'https://www.twitter.com/' + venue_info.twitter;
    
    let a_tag = social_div.eq(1).children('a');
    a_tag.attr('href', twitter_link);
    let label = a_tag.children('span');
    label.contents().filter(function() {
      return (this.nodeType == 3);
    }).remove();
    label.append(document.createTextNode('/' + venue_info.twitter));
  } else {
    let a_tag = social_div.eq(1).children('a');
    a_tag.attr('href', '#')
    let label = a_tag.children('span');
    label.contents().filter(function() {
      return (this.nodeType == 3);
    }).remove();
    label.append(document.createTextNode('N/A'));
  }
}