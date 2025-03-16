// home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_COUNTRIES = gql`
  query {
    countries {
      code
      name
    }
  }
`;

const CREATE_COUNTRY = gql`
  mutation CreateCountry($code: String!, $name: String!) {
    createCountry(code: $code, name: $name) {
      code
      name
    }
  }
`;

const EDIT_COUNTRY = gql`
  mutation EditCountry($code: String!, $name: String!) {
    editCountry(code: $code, name: $name) {
      code
      name
    }
  }
`;

const DELETE_COUNTRY = gql`
  mutation DeleteCountry($code: String!) {
    deleteCountry(code: $code) {
      code
    }
  }
`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Countries</h1>
    <ul>
      <li *ngFor="let country of countries">{{ country.name }} ({{ country.code }})
        <button (click)="editCountry(country.code, 'Updated ' + country.name)">Edit</button>
        <button (click)="deleteCountry(country.code)">Delete</button>
      </li>
    </ul>
    <button (click)="createCountry('XX', 'New Country')">Add Country</button>
  `,
})
export class HomeComponent implements OnInit {
  private apollo = inject(Apollo);
  countries: any[] = [];

  ngOnInit() {
    this.fetchCountries();
  }

  fetchCountries() {
    this.apollo.watchQuery({ query: GET_COUNTRIES }).valueChanges.subscribe(({ data }: any) => {
      this.countries = data.countries;
    });
  }

  createCountry(code: string, name: string) {
    this.apollo.mutate({
      mutation: CREATE_COUNTRY,
      variables: { code, name },
    }).subscribe(() => this.fetchCountries());
  }

  editCountry(code: string, name: string) {
    this.apollo.mutate({
      mutation: EDIT_COUNTRY,
      variables: { code, name },
    }).subscribe(() => this.fetchCountries());
  }

  deleteCountry(code: string) {
    this.apollo.mutate({
      mutation: DELETE_COUNTRY,
      variables: { code },
    }).subscribe(() => this.fetchCountries());
  }
}