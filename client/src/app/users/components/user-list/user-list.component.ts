import { Component, OnInit } from '@angular/core';
import { User } from "../../../core/models/user";
import { Pagination } from "../../../core/models/pagination";
import { StandardParams } from "../../../core/models/params";
import { UsersService } from "../../../core/services/users.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ModalConfirmComponent } from "../../../shared/components/modal-confirm/modal-confirm.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[];
  pagination: Pagination = { currentPage: 1, itemsPerPage: 10 };
  standardParams = new StandardParams();

  constructor(
    private usersService: UsersService,
    private router: Router,
    private toastrService: ToastrService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.standardParams.sortKey = 'userName';
    this.load();
  }

  load() {
    this.usersService.getUsers(this.standardParams).subscribe(response => {
      this.users = response.result;
      this.pagination = response.pagination;
    });
  }

  setTableSort(key: string) {
    if (this.standardParams.sortKey !== key) {
      this.standardParams.sortKey = key;
      this.standardParams.sortDesc = false;
    } else {
      this.standardParams.sortDesc = !this.standardParams.sortDesc;
    }

    this.standardParams.pageNumber = 1;
    this.load();
  }

  pageChanged(event: any) {
    this.standardParams.pageNumber = event;
    this.load();
  }

  add() {
    this.router.navigateByUrl('/admin/users/add').then();
  }

  delete(user: User) {
    const options: NgbModalOptions = {
      backdrop: 'static',
    };

    const modalRef = this.modalService.open(ModalConfirmComponent, options);

    modalRef.componentInstance.title = 'Delete';
    modalRef.componentInstance.message = 'Delete User:';
    modalRef.componentInstance.messageRaw = user.userName;
    modalRef.componentInstance.btnOkText = 'Delete';
    modalRef.componentInstance.btnOkClass = 'btn btn-danger';

    modalRef.result.then((result: string) => {
      if (result === 'btnConfirm') {
        this.usersService.deleteUser(user.id).subscribe(() => {
          this.toastrService.success('Successfully deleted user');
          this.load();
        });
      }
    });
  }
}
